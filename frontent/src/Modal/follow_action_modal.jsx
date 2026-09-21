import React from "react";
import { useEffect } from "react";
import {
  respond_user_follow_click,
  withdrawFollow,
  unfollowUser,
} from "../API layer/user_follow_api";

const FollowActionModal = ({
  targetId,
  status,
  onClose,
  perspective,
}) => {
  const isRequest = status === "Request";
  const isPending = status === "Pending...";
  const isFollowing = status === "Following";

  const handleAction = async (targetId) => {
    try {
      if (isPending) {
        const { success, response, status } = await withdrawFollow(targetId);
        if (success) {
          onClose();
        }
      } else if (isFollowing) {
        const { success, response, status } = await unfollowUser(targetId);
        if (success) {
          onClose();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ResponseFollowAction = async (targetId, action) => {
    const { success, response, status } = await respond_user_follow_click(
      targetId,
      action,
    );
    if (success) {
      onClose();
    }
  };

  // useEffect(() => {
  //   console.log(perspective, "Perspective");
  // }, [perspective]);

  let title, message, buttonText;
  if (isRequest) {
    title = "Respond to Follow Request?";
    message = "Do you want to accept or reject this follow request?";
    buttonText = "Accept";
  } else if (isPending) {
    title = "Withdraw Follow Request?";
    message = "Are you sure you want to withdraw this follow request?";
    buttonText = "Withdraw";
  } else {
    if (perspective === "loginUser") {
      title = "Unfollow User?";
      message = "Are you sure you want to unfollow this user?";
      buttonText = "Unfollow";
    } else {
      title = "Remove Following?";
      message = "Are you sure you want to remove the following?";
      buttonText = "Remove";
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl shadow-lg p-6 relative">
        {/* Title + Cross */}
        <div className="relative mb-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 text-xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm text-center mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          {/* Cancel Button */}
          {isRequest ? (
            <button
              onClick={() => ResponseFollowAction(targetId, "rejected")}
              className="w-1/2 py-2 rounded-full  bg-red-500 hover:bg-red-600 text-white   transition cursor-pointer"
            >
              Reject
            </button>
          ) : (
            <button
              onClick={onClose} // just close
              className="w-1/2 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
          )}

          {/* Action Button */}
          <button
            onClick={() => {
              if (isRequest) {
                ResponseFollowAction(targetId, "accepted");
              } else {
                handleAction(targetId);
              }
            }}
            className={`w-1/2 py-2 cursor-pointer rounded-full text-white transition ${
              isPending
                ? "bg-yellow-500 hover:bg-yellow-600"
                : isRequest
                  ? "bg-green-500 hover:bg-green-600"
                  : " bg-red-500 hover:bg-red-600"
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowActionModal;
