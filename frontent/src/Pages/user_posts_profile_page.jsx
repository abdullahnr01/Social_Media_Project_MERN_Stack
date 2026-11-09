import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Camera,
  Heart,
  Image as ImageIcon,
  LockKeyhole,
  MessageCircle,
  Pencil,
  UserRound,
} from "lucide-react";

import { UserContext } from "../Context/context";
import Follow_button from "../Components/Home/PostCards/user_follow_button";
import Chat_Messaging_Modal from "../Modal/Chat_Box/chat_modal_parent";
import { WhiteScreenLoader } from "../Loader/white_bg_loader";
import { get_user_Profile_OR_Posts_API } from "../API layer/user_post_api";
import {
  get_all_message_API,
  mark_read_conversation_patch_API,
  user_get_or_create_conversion_API,
} from "../API layer/user_live_chat_api";
import { FollowListModal } from "../Modal/follow_list_modal";

const ProfileStat = ({ label, value, onClick }) => {
  const content = (
    <>
      <span className="text-xl font-bold tracking-tight text-slate-900">{value ?? 0}</span>
      <span className="mt-0.5 text-xs font-medium text-slate-500">{label}</span>
    </>
  );

  if (!onClick) {
    return (
      <div className="flex min-w-[82px] flex-col items-center rounded-xl border border-slate-100 bg-white px-4 py-3">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-[82px] flex-col items-center rounded-xl border border-slate-100 bg-white px-4 py-3 transition hover:border-amber-200 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      {content}
    </button>
  );
};

const User_Profile_Posts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const TargetUserId = new URLSearchParams(location.search).get("id");
  const {
    userPostsProfile,
    setUserPostsProfile,
    UserInfo,
    setUnreadMessagesCount,
    setActiveConversationId,
  } = useContext(UserContext);
  const UserLoginId = UserInfo?._id;
  const isOwnProfile = Boolean(
    UserLoginId && TargetUserId && String(UserLoginId) === String(TargetUserId),
  );

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [userChats, setUserChats] = useState([]);
  const [liveChatOpen, setIsLiveChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [profileConversationId, setProfileConversationId] = useState(null);
  const [isFollowListOpen, setIsFollowListOpen] = useState(false);
  const [followListTab, setFollowListTab] = useState("followers");

  useEffect(() => {
    let isCurrent = true;

    const fetchProfile = async () => {
      if (!TargetUserId) {
        setProfileNotFound(true);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setProfileNotFound(false);
      setMessagesLoaded(false);
      setUserChats([]);
      setProfileConversationId(null);
      setActiveConversationId(null);

      try {
        const result = await get_user_Profile_OR_Posts_API(TargetUserId);
        const profile = result?.response?.data?.data?.[0];
        if (!isCurrent) return;

        if (result?.success && profile) {
          setUserPostsProfile(profile);
        } else {
          setProfileNotFound(true);
        }
      } catch (error) {
        if (isCurrent) setProfileNotFound(true);
        console.error("Profile fetch error:", error);
      } finally {
        if (isCurrent) setProfileLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isCurrent = false;
    };
  }, [TargetUserId, setActiveConversationId, setUserPostsProfile]);

  useEffect(() => () => setActiveConversationId(null), [setActiveConversationId]);

  const handleOpenChat = async () => {
    setIsLiveChatOpen(true);
    if (chatLoading) return;

    setChatLoading(true);
    try {
      const conversationResult = await user_get_or_create_conversion_API(TargetUserId);
      if (conversationResult?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const conversationId = conversationResult?.response?.data?.conversationId;
      if (conversationResult?.success && conversationId) {
        setProfileConversationId(conversationId);
        setActiveConversationId(conversationId);
        const unreadCount = Number(conversationResult.response?.data?.unreadCount) || 0;
        if (unreadCount > 0) {
          const readResult = await mark_read_conversation_patch_API(conversationId);
          if (readResult?.success) {
            setUnreadMessagesCount((count) => Math.max(0, count - unreadCount));
          }
        }
      }

      if (messagesLoaded) return;
      const result = await get_all_message_API(TargetUserId);
      if (result?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (result?.success) {
        setUserChats(result.response?.data?.data || []);
        setMessagesLoaded(true);
      }
    } catch (error) {
      console.error("Unable to open profile chat:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCloseChat = () => {
    setIsLiveChatOpen(false);
    setActiveConversationId(null);
  };

  if (profileLoading) {
    return <WhiteScreenLoader message="Loading profile..." />;
  }

  if (profileNotFound || !userPostsProfile) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <UserRound size={27} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">Profile unavailable</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This profile could not be loaded. It may have been removed or the link may be incorrect.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-[#fbba00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e0a600]"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  const posts = userPostsProfile.posts || [];
  const cannotViewPrivatePosts =
    userPostsProfile.isPrivate && !userPostsProfile.canViewPrivateContent;
  const fullName = `${userPostsProfile.firstname || ""} ${userPostsProfile.lastname || ""}`.trim() || "SocialFirst user";

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-3 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-8">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative shrink-0 rounded-full bg-white p-1.5 shadow-lg ring-1 ring-slate-200">
                  {userPostsProfile.image ? (
                    <img
                      src={userPostsProfile.image}
                      alt={`${fullName}'s profile`}
                      referrerPolicy="no-referrer"
                      className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-500 sm:h-28 sm:w-28">
                      <UserRound size={42} aria-hidden="true" />
                    </div>
                  )}
                  <span
                    className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-white ${
                      userPostsProfile.isOnline ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title={userPostsProfile.isOnline ? "Online" : "Offline"}
                  />
                </div>

                <div className="flex-1 pb-1 text-center sm:text-left">
                  <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{fullName}</h1>
                    {userPostsProfile.isOnline && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {isOwnProfile ? "Your SocialFirst profile" : "SocialFirst community member"}
                  </p>
                </div>

                <div className="flex w-full flex-wrap justify-center gap-2 sm:w-auto sm:justify-end">
                  {isOwnProfile ? (
                    <button
                      type="button"
                      onClick={() => navigate("/edit-profile")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fbba00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e0a600] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
                    >
                      <Pencil size={16} aria-hidden="true" /> Edit profile
                    </button>
                  ) : (
                    <>
                      <Follow_button target_userId={TargetUserId} variant="profile" />
                      <button
                        type="button"
                        onClick={handleOpenChat}
                        disabled={chatLoading}
                        className="inline-flex h-11 min-w-[118px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
                      >
                        <MessageCircle size={17} aria-hidden="true" /> {chatLoading ? "Opening..." : "Message"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-7 grid gap-6 border-t border-slate-100 pt-6 md:grid-cols-[1fr_auto] md:items-end">
                <div className="max-w-2xl text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">About</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {userPostsProfile.user_bio || "This user has not added a bio yet."}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  <ProfileStat label="Posts" value={userPostsProfile.totalPosts} />
                  <ProfileStat
                    label="Followers"
                    value={userPostsProfile.followers}
                    onClick={() => {
                      setFollowListTab("followers");
                      setIsFollowListOpen(true);
                    }}
                  />
                  <ProfileStat
                    label="Following"
                    value={userPostsProfile.following}
                    onClick={() => {
                      setFollowListTab("following");
                      setIsFollowListOpen(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">Profile gallery</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Posts</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-500 ring-1 ring-slate-200">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
            </div>

            {cannotViewPrivatePosts ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <LockKeyhole size={25} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">
                  {userPostsProfile.followStatus === "Pending..."
                    ? "Follow request sent"
                    : "This account is private"}
                </h3>
                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                  {userPostsProfile.followStatus === "Pending..."
                    ? "Their posts will appear here if they approve your follow request."
                    : "Follow this account to request access to their posts and profile gallery."}
                </p>
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {posts.map((post) => {
                  const media = post.image?.[0];
                  const isVideo = typeof media === "string" && /\.(mp4|webm|ogg)(\?.*)?$/i.test(media);
                  return (
                    <article
                      key={post._id}
                      className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-200 shadow-sm ring-1 ring-slate-900/5"
                    >
                      {media ? (
                        isVideo ? (
                          <video src={media} muted playsInline className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        ) : (
                          <img src={media} alt={post.title || "User post"} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <ImageIcon size={34} aria-hidden="true" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent p-3 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:p-4">
                        {post.title && <p className="line-clamp-2 text-sm font-semibold text-white">{post.title}</p>}
                        <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-white">
                          <span className="inline-flex items-center gap-1.5"><Heart size={14} fill="currentColor" />{post.likes?.length || 0}</span>
                          {post.image?.length > 1 && <span>{post.image.length} photos</span>}
                        </div>
                      </div>
                      {post.image?.length > 1 && (
                        <span className="absolute right-2 top-2 rounded-full bg-slate-950/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {post.image.length} items
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Camera size={26} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">No posts yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {isOwnProfile ? "Share your first post to start building your gallery." : "This profile has not shared any posts yet."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {liveChatOpen && (
        <Chat_Messaging_Modal
          onclose={handleCloseChat}
          receiverId={TargetUserId}
          conversationId={profileConversationId}
          setUserChats={setUserChats}
          userChats={userChats}
          isLoading={chatLoading}
          receiverProfile={{
            image: userPostsProfile.image,
            firstname: userPostsProfile.firstname,
            lastname: userPostsProfile.lastname,
            online: userPostsProfile.isOnline,
          }}
        />
      )}

      {isFollowListOpen && (
        <FollowListModal
          userId={TargetUserId || UserLoginId}
          initialTab={followListTab}
          onClose={() => setIsFollowListOpen(false)}
        />
      )}
    </>
  );
};

export default User_Profile_Posts;
