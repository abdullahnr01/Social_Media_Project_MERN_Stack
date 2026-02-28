import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//  local

import { UserContext } from "../../../Context/context";
import Follow_button from "../../Home/PostCards/user_follow_button";
import Livechat_modal from "./Modal/livechat_modal";

// API
import { get_user_Profile_OR_Posts_API } from "../../../API layer/user_post_api";
import { get_all_message_API } from "../../../API layer/user_live_chat_api";
const User_Profile_Posts = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  const { userPostsProfile, setUserPostsProfile, UserInfo, setUserChats } =
    useContext(UserContext);

  const [liveChatOpen, setIsLiveChatOpen] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const targetuserId = userPostsProfile._id;

  useEffect(() => {
    console.log(userPostsProfile);
  }, [userPostsProfile]);

  useEffect(() => {
    const fetchUserProfileWithPosts = async () => {
      const { success, response, status } =
        await get_user_Profile_OR_Posts_API(userId);
      if (success) {
        const data = response?.data?.data[0];
        setUserPostsProfile(data);
        // console.log(data);
      }
    };
    fetchUserProfileWithPosts();
  }, [userId]);

  // UserProfile component
  useEffect(() => {
    if (liveChatOpen) {
      socket.emit("joinRoom", conversationId); // backend me socket.join()
    }
  }, [liveChatOpen]);

  const EditProfileRoute = () => {
    navigate("/edit-profile");
  };

  const handleGetAllMessage = async () => {
    if (messagesLoaded) return;
    const { success, response, status } =
      await get_all_message_API(targetuserId);

    console.log(response?.data?.data);

    if (status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }

    if (success) {
      setUserChats(response?.data?.data);
      setMessagesLoaded(true);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 🔥 Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-10  p-6  ">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={userPostsProfile?.image || "/default-profile.png"}
              alt="profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Name */}
            <h2 className="text-3xl font-semibold text-gray-800">
              {userPostsProfile?.firstname} {userPostsProfile?.lastname}
            </h2>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-6 mt-5">
              {/* Posts */}
              <div className="flex flex-col items-center bg-white rounded-3xl px-6 py-4 shadow-md hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300 w-28">
                <span className="font-bold text-xl">
                  {userPostsProfile?.totalPosts || 0}
                </span>
                <span className="text-gray-500 text-sm mt-1">Posts</span>
              </div>

              {/* Likes */}
              <div className="flex flex-col items-center bg-white rounded-3xl px-6 py-4 shadow-md hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300 w-28">
                <span className="font-bold text-xl">
                  {userPostsProfile?.totalLikes || 0}
                </span>
                <span className="text-gray-500 text-sm mt-1">Likes</span>
              </div>

              {/* Connections */}
              <div className="flex flex-col items-center bg-white rounded-3xl px-6 py-4 shadow-md hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300 w-28">
                <span className="font-bold text-xl">
                  {userPostsProfile?.totalFriends || 0}
                </span>
                <span className="text-gray-500 text-sm mt-1">Connections</span>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-5 text-gray-700 text-sm max-w-md">
              {userPostsProfile?.bio || "This user hasn't added a bio yet."}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center md:justify-start gap-2">
              {/* Follow Button */}
              <Follow_button post_userId={userPostsProfile._id} />

              {/* Message Button */}

              <button
                className={`px-6 py-2 text-sm font-medium border transition-colors duration-200 cursor-pointer
    ${
      UserInfo._id !== userPostsProfile._id
        ? "bg-white border-gray-500 text-gray-700 rounded-full"
        : "bg-white border-gray-500 text-gray-700 hover:bg-yellow-500 hover:text-white w-50 rounded-lg hover:border-none"
    }`}
                onClick={() => {
                  if (UserInfo._id !== userPostsProfile._id) {
                    handleGetAllMessage(); // async function
                    setIsLiveChatOpen(true);
                  } else {
                    EditProfileRoute();
                  }
                }}
              >
                {UserInfo._id !== userPostsProfile._id
                  ? "Message"
                  : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 User Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
          {userPostsProfile?.posts?.map((post) => (
            <div
              key={post._id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm"
            >
              <img
                src={post.image[0]}
                alt="post"
                className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
                View Post
              </div>
            </div>
          ))}
        </div>
      </div>

      {liveChatOpen && (
        <Livechat_modal
          onclose={setIsLiveChatOpen}
          receiverId={userPostsProfile._id}
        />
      )}
    </>
  );
};

export default User_Profile_Posts;
