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

    const {setAllPosts} = useContext(UserContext)

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected", socket.id);
    });

    socket.on("likeUpdated", (data) => {
      setAllPosts((prev) =>
        prev.map((p) =>
          p._id === data.postId ? { ...p, likeCount: data.likeCount } : p,
        ),
      );
    });

    return () => {
      socket.off("likeUpdated");
    };
  }, []);

  const handlePostLikes = async (data) => {
    try {
      const { success, response } = await user_post_likes(data);
      if (!success) return;

      const resdata = response?.data;
      const colordata = resdata?.isLiked;

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
      aria-label={postLiked ? "Unlike post" : "Like post"}
      onClick={() => handlePostLikes(postId)}
      className="flex min-w-20 flex-col items-center gap-1.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 cursor-pointer"
    >
      <FaHeart className={`text-lg ${postLiked ? "text-rose-500" : "text-slate-500"}`} aria-hidden="true" />
      <span className="text-xs text-slate-500">{likeCounts ?? 0} Likes</span>
    </button>
  );
};

export default User_like_Btn;
