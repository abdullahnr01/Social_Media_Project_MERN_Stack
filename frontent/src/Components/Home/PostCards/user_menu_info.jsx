import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { UserContext } from "../../../Context/context";

const User_menu_info = ({ post }) => {
  const navigate = useNavigate();
  const { setUserPostsProfile } = useContext(UserContext);

  const ClickUserPostProfile = () => {
    navigate(`/user_profile_posts?id=${post.userInfo._id}`);
  };

  return (
    <div
      className="flex items-start space-x-3 cursor-pointer"
      onClick={() => {
        ClickUserPostProfile();
      }}
    >
      {post?.userInfo?.image ? (
        <img
          src={post.userInfo.image}
          alt="Profile Image"
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <FaUserCircle className="w-10 h-10 text-gray-400" />
      )}

      <div className="flex flex-col">
        <span className="font-semibold text-gray-800 text-sm">
          {`${post?.userInfo?.firstname} ${post?.userInfo?.lastname}`}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default User_menu_info;
