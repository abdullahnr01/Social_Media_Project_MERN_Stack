import React from "react";
import { useState, useEffect, useContext } from "react";

import io from "socket.io-client";
const socket = io("http://localhost:9090");
import FollowActionModal from "../../../Modal/withdraw_req_modal";

import {
  user_follow_click,
  withdrawFollow,
  unfollowUser,
} from "../../../API layer/user_follow_api";
import { UserContext } from "../../../Context/context";

const Follow_button = ({ post_userId }) => {
  const [followStatus, setFollowStatus] = useState({});
  //
  const [iswithdrawModalOpen, setIswithdrawModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const { AllPosts, userPostsProfile, UserInfo } = useContext(UserContext);

  useEffect(() => {
    const handleFollowUpdate = ({ targetId, loginUserId, follow_Status }) => {
      setFollowStatus((prev) => ({
        ...prev,

        // Update both sides
        [targetId]: follow_Status,
        [loginUserId]: follow_Status,
      }));
    };

    socket.on("followStatusUpdated", handleFollowUpdate);

    return () => socket.off("followStatusUpdated", handleFollowUpdate);
  }, []);

  useEffect(() => {
    const handleFollowUpdate = ({
      targetUserId,
      loginUserId,
      follow_Status,
    }) => {
   
      setFollowStatus((prev) => ({
        ...prev,
        [targetUserId]: follow_Status,
        [loginUserId]: follow_Status,
      }));
    };

    socket.on("UnfollowStatusUpdate", handleFollowUpdate);

    return () => {
      socket.off("UnfollowStatusUpdate", handleFollowUpdate);
    };
  }, []);

  // useEffect(() => {
  //   console.log("Updated followStatus:", followStatus);
  // }, [followStatus]);

  useEffect(() => {
    const map = {};
    if (AllPosts?.length > 0) {
      AllPosts.forEach((post) => {
        map[post.user_id] = post.followStatus || "Follow";
      });
    }

    if (userPostsProfile?.posts?.length > 0) {
      userPostsProfile.posts.forEach((post) => {
        map[post.user_id] = post.followStatus || "Follow";
      });
    }
    if (userPostsProfile?._id) {
      map[userPostsProfile._id] = userPostsProfile.followStatus || "Follow";
    }

    setFollowStatus(map);
  }, [AllPosts, userPostsProfile]);

  const handlePostFollowReq = async (targetUserId) => {
    const currentStatus = followStatus[targetUserId];

    if (currentStatus === "Pending..." || currentStatus === "Following") {
      setSelectedUserId(targetUserId);
      setSelectedStatus(currentStatus);
      setIswithdrawModalOpen(true);
      return;
    }

    const { success, response } = await user_follow_click(targetUserId);

    console.log(response?.data.value);

    if (success) {
      setFollowStatus((prev) => ({
        ...prev,
        [targetUserId]: response.data.value,
      }));
    }
  };

  return (
    <>
      <div>
        {UserInfo?._id !== post_userId && (
          <button
            className="px-6 py-2 bg-[#fbba00] text-white text-sm font-medium rounded-full hover:bg-[#e0a800] transition-colors duration-200 cursor-pointer"
            onClick={() => handlePostFollowReq(post_userId)}
          >
            {followStatus[post_userId]}
          </button>
        )}
      </div>

      {iswithdrawModalOpen && (
        <FollowActionModal
          status={selectedStatus}
          onClose={() => setIswithdrawModalOpen(false)}
          onConfirm={async () => {
            if (selectedStatus === "Pending...") {
              const { success, response, status } =
                await withdrawFollow(selectedUserId);
              if (success) {
                setFollowStatus((prev) => ({
                  ...prev,
                  [selectedUserId]: response?.data.value,
                }));
              }
            } else if (selectedStatus === "Following") {
              const { success, response, status } =
                await unfollowUser(selectedUserId);

              if (success) {
                setFollowStatus((prev) => ({
                  ...prev,
                  [selectedUserId]: response?.data.value,
                }));
              }
            }

            setIswithdrawModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Follow_button;
