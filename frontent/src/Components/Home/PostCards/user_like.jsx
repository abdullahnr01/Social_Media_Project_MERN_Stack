import React, { useEffect } from "react";
import { useContext } from "react";

import { UserContext } from "../../../Context/context";

import io from "socket.io-client";
const socket = io("http://localhost:9090");
import {
  FaHeart,
} from "react-icons/fa";
import { user_post_likes } from "../../../API layer/api";

const User_like_Btn = ({ likeCounts, postId, postLiked }) => {
  const { setAllPosts } = useContext(UserContext);
  const [isLiked, setIsLiked] = React.useState(Boolean(postLiked));
  const [currentLikeCount, setCurrentLikeCount] = React.useState(Number(likeCounts) || 0);

  useEffect(() => setIsLiked(Boolean(postLiked)), [postLiked]);
  useEffect(() => setCurrentLikeCount(Number(likeCounts) || 0), [likeCounts]);

  useEffect(() => {
    const handleLikeUpdated = (data) => {
      if (data?.postId !== postId) return;
      setCurrentLikeCount(Number(data.likeCount) || 0);
      setAllPosts((prev) =>
        prev.map((p) =>
          p._id === data.postId ? { ...p, likeCount: data.likeCount } : p,
        ),
      );
    };
    socket.on("likeUpdated", handleLikeUpdated);

    return () => {
      socket.off("likeUpdated", handleLikeUpdated);
    };
  }, [postId, setAllPosts]);

  const handlePostLikes = async (data) => {
    try {
      const { success, response } = await user_post_likes(data);
      if (!success) return;

      const resdata = response?.data;
      const colordata = resdata?.isLiked;
      setIsLiked(Boolean(colordata));
      setCurrentLikeCount(Number(resdata?.likeCount) || 0);

      setAllPosts((prev) =>
        prev.map((p) => (p._id === data ? { ...p, isLiked: colordata } : p)),
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <button
      type="button"
      aria-label={isLiked ? "Unlike post" : "Like post"}
      onClick={() => handlePostLikes(postId)}
      className="flex min-w-20 flex-col items-center gap-1.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 cursor-pointer"
    >
      <FaHeart className={`text-lg ${isLiked ? "text-rose-500" : "text-slate-500"}`} aria-hidden="true" />
      <span className="text-xs text-slate-500">{currentLikeCount} Likes</span>
    </button>
  );
};

export default User_like_Btn;
