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
    <>
      <button className="flex flex-col items-center group">
        <div className="flex items-center gap-2 group-hover:text-red-500 transition-colors">
          <FaHeart
            className={`text-lg cursor-pointer ${
              postLiked ? "text-red-500" : "text-gray-500"
            }`}
            onClick={() => handlePostLikes(postId)}
          />
        </div>
        <span className="text-xs text-gray-400 mt-1">{likeCounts} Likes</span>
      </button>
    </>
  );
};

export default User_like_Btn;
