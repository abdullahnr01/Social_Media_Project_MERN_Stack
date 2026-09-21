import React from "react";
import { useState, useEffect, useContext } from "react";

import socket from "../../Socket/socket_io";
import FollowActionModal from "../../../Modal/follow_action_modal";

import { UserContext } from "../../../Context/context";
//  API , Import Files ---------------------
import {
  user_follow_click,
  withdrawFollow,
  unfollowUser,
} from "../../../API layer/user_follow_api";

const Follow_button = ({ target_userId }) => {
  console.log(target_userId);

  //
  const [iswithdrawModalOpen, setIswithdrawModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPerspective, setSelectPerspective] = useState("");

  const {
    AllPosts,
    userPostsProfile,
    UserInfo,
    followStatus,
    setFollowStatus,
  } = useContext(UserContext);

  console.log(userPostsProfile);

  // UserLogin Id ---------------
  const UserLoginId = UserInfo._id;

  // Post Follow Button live socket useeffect

  useEffect(() => {
    if (!socket || !UserLoginId) {
      return;
    }

    const handleRequestReceived = ({ from, status }) => {
      // console.log("RECEIVED:", from, status);
      setFollowStatus((prev) => ({
        ...prev,
        [from]: status,
      }));
    };

    const handleRequestSent = ({ to, status }) => {
      // console.log("SENT:", to, status);

      setFollowStatus((prev) => ({
        ...prev,
        [to]: status,
      }));
    };

    socket.on("followRequestReceived", handleRequestReceived);
    socket.on("followRequestSent", handleRequestSent);

    return () => {
      socket.off("followRequestReceived", handleRequestReceived);
      socket.off("followRequestSent", handleRequestSent);
    };
  }, [UserLoginId]);

  // Responsed follow using live socket useeffect

  useEffect(() => {
    const handleFollowUpdate = ({ userId, follow_Status }) => {
      console.log("Follow Updated:", userId, follow_Status);

      setFollowStatus((prev) => ({
        ...prev,
        [userId]: follow_Status,
      }));
    };

    socket.on("followStatusUpdated", handleFollowUpdate);

    return () => {
      socket.off("followStatusUpdated", handleFollowUpdate);
    };
  }, []);

  // withdraw follow using live socket useeffect

  useEffect(() => {
    const handleWithdrawUpdate = ({ userId, follow_Status }) => {
      console.log("Follow Updated:", userId, follow_Status);

      setFollowStatus((prev) => ({
        ...prev,
        [userId]: follow_Status,
      }));
    };

    socket.on("WithdrawStatusUpdated", handleWithdrawUpdate);

    return () => {
      socket.off("WithdrawStatusUpdated", handleWithdrawUpdate);
    };
  }, []);

  // Unfollow using live socket useeffect

  useEffect(() => {
    const handleUnfollowUpdate = ({ userId, follow_Status }) => {
      console.log("Follow Updated:", userId, follow_Status);

      setFollowStatus((prev) => ({
        ...prev,
        [userId]: follow_Status,
      }));
    };

    socket.on("UnfollowStatusUpdated", handleUnfollowUpdate);

    return () => {
      socket.off("UnfollowStatusUpdated", handleUnfollowUpdate);
    };
  }, []);

  useEffect(() => {
    console.log("Updated followStatus:", followStatus);
  }, [followStatus]);

  useEffect(() => {
    setFollowStatus((prev) => {
      const updated = { ...prev };

      if (AllPosts?.length > 0) {
        AllPosts.forEach((post) => {
          updated[post.user_id] = post.followStatus || "Follow";
        });
      }

      if (userPostsProfile?.posts?.length > 0) {
        userPostsProfile.posts.forEach((post) => {
          updated[post.user_id] = post.followStatus || "Follow";
        });
      }

      if (userPostsProfile?._id) {
        updated[userPostsProfile._id] =
          userPostsProfile.followStatus || "Follow";
      }

      return updated;
    });
  }, [AllPosts, userPostsProfile]);

  // Send Follow Request Function ------------
  const handlePostFollowReq = async (targetUserId) => {
    const currentStatus =
      followStatus[targetUserId] || followStatus[UserLoginId];

    console.log(currentStatus);
    console.log(followStatus[UserLoginId]);

    if (currentStatus === "Request") {
      setSelectedUserId(targetUserId);
      setSelectedStatus(currentStatus);
      setIswithdrawModalOpen(true);
      return;
    }

    if (currentStatus === "Pending..." || currentStatus === "Following") {
      let perspective;
      if (currentStatus === "Following") {
        perspective =
          followStatus[UserLoginId] === "Following"
            ? "loginUser"
            : "targetUser";
      }

      console.log(perspective);

      setSelectedUserId(targetUserId);
      setSelectedStatus(currentStatus);
      setSelectPerspective(perspective);
      setIswithdrawModalOpen(true);
      return;
    }

    const { success, response } = await user_follow_click(targetUserId);

    // if (success) {
    //   setFollowStatus((prev) => ({
    //     ...prev,
    //     [targetUserId]: response.data.value,
    //   }));
    // }
  };

  return (
    <>
      <div>
        {UserLoginId !== target_userId && (
          <button
            className="px-6 py-2 bg-[#fbba00] text-white text-sm font-medium rounded-full hover:bg-[#e0a800] transition-colors duration-200 cursor-pointer"
            onClick={() => handlePostFollowReq(target_userId)}
          >
            {followStatus[target_userId] || "Follow"}
          </button>
        )}
      </div>

      {iswithdrawModalOpen && (
        <FollowActionModal
          targetId={selectedUserId}
          status={selectedStatus}
          perspective={selectedPerspective}
          onClose={() => setIswithdrawModalOpen(false)}
        />
      )}
    </>
  );
};

export default Follow_button;
