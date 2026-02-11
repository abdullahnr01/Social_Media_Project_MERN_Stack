import React from "react";

const FollowActionModal = ({ status, onClose, onConfirm }) => {
  const isPending = status === "Pending...";
  const isFollowing = status === "Following";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl shadow-lg p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {isPending ? "Withdraw Follow Request?" : "Unfollow User?"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-sm text-center mb-6">
          {isPending
            ? "Are you sure you want to withdraw this follow request?"
            : "Are you sure you want to unfollow this user?"}
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>

          {/* Action Button */}
          <button
            onClick={onConfirm}
            className={`w-1/2 py-2 cursor-pointer rounded-full text-white transition ${
              isPending
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPending ? "Withdraw" : "Unfollow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowActionModal;
