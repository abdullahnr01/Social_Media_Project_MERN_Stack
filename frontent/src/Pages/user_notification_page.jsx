import { useEffect, useState } from "react";
import { FaBellSlash, FaHeart } from "react-icons/fa";
import { get_user_notification } from "../API layer/api";
import { respond_user_follow_click } from "../API layer/user_follow_api";
import { WhiteScreenLoader } from "../Loader/white_bg_loader";
import socket from "../Socket/socket_io";

export const User_Notification = () => {
  const [request, setRequest] = useState([]);
  const [likes, setLikes] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGetAllNotification = async () => {
    try {
      setLoading(true);
      const { success, response } = await get_user_notification();
      if (success) {
        setRequest(response?.data?.data || []);
        setLikes((previous) => {
          const combined = new Map();
          [...(response?.data?.likes || []), ...previous].forEach((item) => {
            combined.set(item._id, item);
          });
          return [...combined.values()].sort(
            (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
          );
        });
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllNotification();
  }, []);

  useEffect(() => {
    const handleNewLikeNotification = (notification) => {
      setLikes((previous) => [
        notification,
        ...previous.filter((item) => item._id !== notification._id),
      ]);
    };

    socket.on("newPostLikeNotification", handleNewLikeNotification);
    return () => socket.off("newPostLikeNotification", handleNewLikeNotification);
  }, []);

  const respondFollowReq = async (targetId, action) => {
    const { success } = await respond_user_follow_click(targetId, action);
    if (success) {
      setRemovingId(targetId);
      setTimeout(() => {
        setRequest((previous) =>
          previous.filter((item) => item.loginUser._id !== targetId),
        );
        setRemovingId(null);
      }, 300);
    }
  };

  if (loading) {
    return <WhiteScreenLoader message="Loading your notifications..." />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="mt-1 text-sm text-gray-500">Follow requests and post likes</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {request.length > 0 || likes.length > 0 ? (
          <>
            {request.map((item) => (
              <div
                key={`follow-${item._id}`}
                className={`border-b border-gray-100 p-5 transition-all duration-300 ${
                  removingId === item.loginUser._id
                    ? "translate-x-[150%] opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.loginUser?.image || "https://via.placeholder.com/120"}
                      alt=""
                      className="h-12 w-12 rounded-full border border-gray-300 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.loginUser?.firstname} {item.loginUser?.lastname}
                      </p>
                      <p className="text-xs text-gray-500">sent you a follow request</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-[11px] text-gray-400">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="ml-[60px] mt-3 flex gap-2">
                  <button
                    className="rounded-full bg-green-500 px-5 py-1.5 text-xs text-white shadow-sm transition-all hover:bg-green-600"
                    onClick={() => respondFollowReq(item?.loginUser?._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="rounded-full bg-red-500 px-5 py-1.5 text-xs text-white shadow-sm transition-all hover:bg-red-600"
                    onClick={() => respondFollowReq(item?.loginUser?._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {likes.map((item) => {
              const actorName = [item.actor?.firstname, item.actor?.lastname]
                .filter(Boolean)
                .join(" ");
              const postImage = Array.isArray(item.post?.image)
                ? item.post.image[0]
                : item.post?.image;

              return (
                <div
                  key={`like-${item._id}`}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 p-5 last:border-none"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={item.actor?.image || "https://via.placeholder.com/120"}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{actorName || "Someone"}</span>{" "}
                        liked your post.
                      </p>
                      {item.post?.title && (
                        <p className="mt-1 truncate text-xs text-gray-500">{item.post.title}</p>
                      )}
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(item.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {postImage && (
                      <img src={postImage} alt="Liked post" className="h-12 w-12 rounded-lg object-cover" />
                    )}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <FaHeart aria-hidden="true" />
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FaBellSlash className="mb-3 text-4xl" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};
