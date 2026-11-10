// local
import {
  user_comment_post,
  All_CommentGets,
  user_comment_reply_post,
  All_Comment_Reply_Gets,
} from "../API layer/api";

import { all_data } from "../API layer/user_post_api";

import { UserContext } from "../Context/context";

import { WhiteScreenLoader } from "../Loader/white_bg_loader";

// built in
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import {
  ImagePlus,
  MessageCircle,
  MessagesSquare,
  UserRound,
} from "lucide-react";

//
import io from "socket.io-client";
const socket = io("http://localhost:9090");

import PostCards from "../Components/Home/PostCards/PostCards_parent";
import FeedSidebar from "../Components/Home/feed_sidebar";
import SuggestedUsersPanel from "../Components/Home/suggested_users_panel";

const ProfileAvatar = ({ image, name, size = "h-10 w-10" }) => (
  <span className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50 text-amber-600 ring-1 ring-slate-200`}>
    {image ? (
      <img src={image} alt={name || ""} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
    ) : (
      <UserRound size={20} aria-hidden="true" />
    )}
  </span>
);

//
function Home() {
  const { AllPosts, setAllPosts, UserInfo } = useContext(UserContext);

  // Loader State

  const [pageLoading, setPageLoading] = useState(true);

  // states

  //
  const [AllCommentGets, setAllCommentGets] = useState({});
  const [commentReplies, setCommentReplies] = useState({});

  //
  const [commentbox, setCommentbox] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [showReplies, setShowReplies] = useState(null);

  const navigate = useNavigate();
  const fullName = `${UserInfo?.firstname || ""} ${UserInfo?.lastname || ""}`.trim() || "Your profile";
  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    socket.on("newCommentAdded", (data) => {
      const postId = data?.comment?.postId;
      const comment = data?.comment;
      if (!postId || !comment?._id) return;

      setAllCommentGets((prev) => ({
        ...prev,
        [postId]: prev[postId]?.some((item) => item._id === comment._id)
          ? prev[postId]
          : [comment, ...(prev[postId] || [])],
      }));
    });

    return () => socket.off("newCommentAdded");
  }, []);
  // comment reply useeffect
  useEffect(() => {
    socket.on("commentReplyAdded", (data) => {
      const commentreply = data?.data || [];
      const commentIdKey = data?.data?.commentId;
      if (!commentIdKey || !commentreply?._id) return;

      setCommentReplies((prev) => ({
        ...prev,
        [commentIdKey]: prev[commentIdKey]?.some((item) => item._id === commentreply._id)
          ? prev[commentIdKey]
          : [commentreply, ...(prev[commentIdKey] || [])],
      }));
    });

    return () => socket.off("commentReplyAdded");
  }, []);

  const fetchHomeData = async () => {
    try {
      const { success, response, status } = await all_data();
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (!success) return;
      setAllPosts(response?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };
  // Comment Section ----------------

  const handleGetAllComments = async (PostId) => {
    try {
      const { success, response, status } = await All_CommentGets(PostId);
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (success) {
        const comments = response?.data || [];
        setAllCommentGets((previous) => ({ ...previous, [PostId]: comments }));
      }
    } catch (err) {
      console.error("Get All Comments Error", err);
    }
  };

  const handlePostComment = async (data, { resetForm }, PostId) => {
    try {
      const payload = { ...data, PostId };

      const { success, response, status } = await user_comment_post(payload);

      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (success) {
        resetForm();
        const createdComment = response?.data?.comment;
        if (createdComment?._id) {
          setAllCommentGets((prev) => ({
            ...prev,
            [PostId]: prev[PostId]?.some((item) => item._id === createdComment._id)
              ? prev[PostId]
              : [createdComment, ...(prev[PostId] || [])],
          }));
        }
      }
    } catch (err) {
      console.error("Post Comment Error", err);
    }
  };

  const handleGetCommentReplys = async (commentId) => {
    try {
      const { success, response, status } =
        await All_Comment_Reply_Gets(commentId);
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (success) {
        const commentReplys = response?.data || [];
        setCommentReplies((previous) => ({ ...previous, [commentId]: commentReplys }));
      }
    } catch (err) {
      console.error("Get All Comments Replies Error", err);
    }
  };

  const handleCommentReplyInput = async (data, { resetForm }, commentId) => {
    try {
      const payLoad = { ...data, commentId };
      const { success, response, status } =
        await user_comment_reply_post(payLoad);
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const CommentId = response?.data?.data?.commentId || commentId;

      if (success) {
        resetForm();
        setShowReplyInput(null);
        setShowReplies(CommentId);
        const createdReply = response?.data?.data;
        if (createdReply?._id) {
          setCommentReplies((prev) => ({
            ...prev,
            [CommentId]: prev[CommentId]?.some((item) => item._id === createdReply._id)
              ? prev[CommentId]
              : [createdReply, ...(prev[CommentId] || [])],
          }));
        }
      }
    } catch (err) {
      console.error("Post Comments Replies Error", err);
    }
  };

  // Loader Section JSX

  if (pageLoading) {
    return <WhiteScreenLoader />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_250px] xl:grid-cols-[220px_minmax(0,660px)_280px] xl:gap-7">
          <FeedSidebar />

          <main className="mx-auto w-full min-w-0 max-w-2xl lg:max-w-none">
            <div className="space-y-5">
          {AllPosts.length === 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><MessagesSquare size={25} aria-hidden="true" /></span>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Your feed is quiet</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">Share a moment with your community or check back later for new posts.</p>
              <button type="button" onClick={() => navigate("/create-post")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#fbba00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e0a600] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200">
                <ImagePlus size={17} aria-hidden="true" /> Create a post
              </button>
            </section>
          ) : AllPosts.map((post, index) => (
            <div
              key={post._id || index}
              className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <PostCards
                post={post}
                index={index}
                commentsOpen={commentbox === post._id}
                onCommentClick={() => {
                  if (commentbox === post._id) {
                    setCommentbox(null);
                  } else {
                    setCommentbox(post._id);
                    handleGetAllComments(post._id);
                  }
                }}
              />

              {/* Comment Input field    section----4  */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden  mb-2 ${
                  commentbox === post._id
                    ? "max-h-44 border-t border-slate-100 bg-slate-50/50 py-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <Formik
                  initialValues={{ comment: "" }}
                  validationSchema={Yup.object({
                    comment: Yup.string().required("Comment cannot be empty"),
                  })}
                  onSubmit={(values, action) => {
                    handlePostComment(values, action, post._id);
                  }}
                >
                  {({ isSubmitting, handleSubmit, setFieldValue }) => (
                    <Form
                      className="flex items-start gap-3 px-4"
                      onSubmit={handleSubmit}
                    >
                      <ProfileAvatar image={UserInfo?.image} name={fullName} size="h-9 w-9" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Field
                          name="comment"
                          type="text"
                          placeholder="Write a comment..."
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                          onChange={(e) => {
                            let value = e.target.value;
                            if (value === " ") return;
                            value = value.replace(/\s{2,}/g, " ");
                            setFieldValue("comment", value);
                          }}
                        />
                        <ErrorMessage
                          name="comment"
                          component="p"
                          className="ml-2 mt-1 text-xs text-red-600"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#fbba00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e0a600] disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSubmitting ? "Sending..." : "Send"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>

              {/* Comment message and comment replays  section---5  */}
              {commentbox === post._id && (
                <div className="max-h-80 space-y-3 overflow-y-auto bg-slate-50/50 px-4 pb-4 pt-1 sm:px-5">
                  {AllCommentGets[post._id]?.length > 0 ? (
                    AllCommentGets[post._id]?.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex items-start gap-3"
                      >
                        <ProfileAvatar image={comment?.userId?.image} name={comment?.userId?.firstname} size="h-9 w-9" />
                        <div className="min-w-0 flex-1">
                          <div className="rounded-2xl border border-slate-200/80 bg-white px-3.5 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-slate-800">{comment?.userId?.firstname || "SocialFirst user"}</p>
                            <span className="shrink-0 text-[11px] text-slate-400">{format(comment.createdAt)}</span>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-700">{comment.comment}</p>

                            {/* Actions */}
                            <div className="mt-2 flex gap-4 text-xs font-medium text-slate-500">
                              <button
                                type="button"
                                className="transition hover:text-amber-700"
                                onClick={() => {
                                  if (showReplies === comment._id) {
                                    setShowReplies(null);
                                  } else {
                                    setShowReplies(comment._id);
                                    handleGetCommentReplys(comment._id);
                                  }
                                }}
                              >
                                {showReplies === comment._id
                                  ? "Hide replies"
                                  : "View replies"}
                              </button>
                              <button
                                type="button"
                                className="transition hover:text-amber-700"
                                onClick={() => {
                                  if (showReplyInput === comment._id) {
                                    setShowReplyInput(null);
                                  } else {
                                    setShowReplyInput(comment._id);
                                  }
                                }}
                              >
                                Reply
                              </button>
                            </div>
                        </div>

                        {/* Static Reply Input (UI only) */}
                        {showReplyInput === comment._id && (
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden `}
                          >
                            <Formik
                              initialValues={{ reply: "" }}
                              validationSchema={Yup.object({
                                reply: Yup.string().required(
                                  "Reply cannot be empty",
                                ),
                              })}
                              onSubmit={(values, action) =>
                                handleCommentReplyInput(
                                  values,
                                  action,
                                  comment._id,
                                )
                              }
                            >
                              {({
                                isSubmitting,
                                handleSubmit,
                                setFieldValue,
                              }) => (
                                <Form
                                  className="mt-2 flex items-start gap-2"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="min-w-0 flex-1 flex-col">
                                    <Field
                                      name="reply"
                                      type="text"
                                      placeholder="Write a reply..."
                                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                                      onChange={(e) => {
                                        let value = e.target.value;
                                        if (value === " ") return;
                                        value = value.replace(/\s{2,}/g, " ");
                                        setFieldValue("reply", value);
                                      }}
                                    />
                                    <ErrorMessage
                                      name="reply"
                                      component="p"
                                      className="ml-2 mt-1 text-xs text-red-600"
                                    />
                                  </div>
                                  <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                                  >
                                    Reply
                                  </button>
                                </Form>
                              )}
                            </Formik>
                          </div>
                        )}

                        {/* Static Replies List */}

                        {showReplies === comment._id && (
                          <div className="mt-3 space-y-2 border-l-2 border-amber-200 pl-3">
                            {commentReplies[comment._id]?.length > 0 ? (
                              commentReplies[comment._id]?.map(
                                (reply, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2.5"
                                  >
                                    <ProfileAvatar image={reply?.userId?.image} name={reply?.userId?.firstname} size="h-7 w-7" />

                                    <div className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/80">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-semibold text-slate-800">
                                          {reply?.userId?.firstname ||
                                            "Unknown User"}
                                        </p>
                                        <span className="text-[10px] text-slate-400">
                                          {format(reply.createdAt)}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-sm text-slate-700">
                                        {reply?.commentReply}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )
                            ) : (
                              <p className="text-xs text-slate-500">
                                No replies yet.
                              </p>
                            )}
                          </div>
                        )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500">
                      No comments yet. Start the conversation.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
            </div>
          </main>
          <SuggestedUsersPanel />
        </div>
      </div>
    </div>
  );
}

export default Home;
