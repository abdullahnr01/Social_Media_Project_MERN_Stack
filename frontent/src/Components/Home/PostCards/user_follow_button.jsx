import { useContext, useEffect, useState } from "react";
import socket from "../../../Socket/socket_io";
import FollowActionModal from "../../../Modal/follow_action_modal";
import { UserContext } from "../../../Context/context";
import { user_follow_click } from "../../../API layer/user_follow_api";

const Follow_button = ({ target_userId, variant = "default", initialStatus, onStatusChange }) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    UserInfo,
    followStatus,
    setFollowStatus,
    userPostsProfile,
    setUserPostsProfile,
  } = useContext(UserContext);
  const UserLoginId = UserInfo?._id;
  const buttonLabel = followStatus[target_userId] ?? initialStatus ?? "Follow";
  const isProfileVariant = variant === "profile";
  const isSuggestionVariant = variant === "suggestion";
  const visibleButtonLabel = isSuggestionVariant
    ? buttonLabel === "Pending..."
      ? "Requested"
      : buttonLabel === "Request"
        ? "Respond"
        : buttonLabel
    : buttonLabel;
  const profileButtonStateClass =
    buttonLabel === "Following"
      ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
      : buttonLabel === "Request" || buttonLabel === "Pending..."
        ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
        : "border border-transparent bg-[#fbba00] text-white hover:bg-[#e0a800]";

  useEffect(() => {
    if (!target_userId || !initialStatus) return;
    setFollowStatus((previous) => ({
      ...previous,
      [target_userId]: initialStatus,
    }));
  }, [target_userId, initialStatus, setFollowStatus]);

  useEffect(() => {
    if (!UserLoginId) return undefined;

    const updateStatus = ({ userId, follow_Status }) => {
      if (!userId || !follow_Status) return;
      setFollowStatus((previous) => ({ ...previous, [userId]: follow_Status }));
    };
    const handleRequestReceived = ({ from, status }) => updateStatus({ userId: from, follow_Status: status });
    const handleRequestSent = ({ to, status }) => updateStatus({ userId: to, follow_Status: status });

    socket.on("followRequestReceived", handleRequestReceived);
    socket.on("followRequestSent", handleRequestSent);
    socket.on("followStatusUpdated", updateStatus);
    socket.on("WithdrawStatusUpdated", updateStatus);
    socket.on("UnfollowStatusUpdated", updateStatus);

    return () => {
      socket.off("followRequestReceived", handleRequestReceived);
      socket.off("followRequestSent", handleRequestSent);
      socket.off("followStatusUpdated", updateStatus);
      socket.off("WithdrawStatusUpdated", updateStatus);
      socket.off("UnfollowStatusUpdated", updateStatus);
    };
  }, [UserLoginId, setFollowStatus]);

  const handlePostFollowReq = async () => {
    if (!target_userId || isLoading) return;

    if (buttonLabel === "Request" || buttonLabel === "Pending..." || buttonLabel === "Following") {
      setSelectedStatus(buttonLabel);
      setIsActionModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await user_follow_click(target_userId);
      if (result?.success) {
        const nextStatus = result.response?.data?.followStatus || "Pending...";
        setFollowStatus((previous) => ({ ...previous, [target_userId]: nextStatus }));
        onStatusChange?.(nextStatus, { action: "follow" });
        if (nextStatus === "Following" && buttonLabel !== "Following") {
          setUserPostsProfile((previous) =>
            String(previous?._id) === String(target_userId)
              ? { ...previous, followers: Math.max(0, (Number(previous.followers) || 0) + 1) }
              : previous,
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (nextStatus, { action } = {}) => {
    setFollowStatus((previous) => ({ ...previous, [target_userId]: nextStatus }));
    onStatusChange?.(nextStatus, { action });
    if (selectedStatus === "Following" && nextStatus === "Follow") {
      setUserPostsProfile((previous) =>
        String(previous?._id) === String(target_userId)
          ? { ...previous, followers: Math.max(0, (Number(previous.followers) || 0) - 1) }
          : previous,
      );
    } else if (selectedStatus === "Request" && action === "accepted") {
      setUserPostsProfile((previous) =>
        String(previous?._id) === String(target_userId)
          ? { ...previous, following: (Number(previous.following) || 0) + 1 }
          : previous,
      );
    }
  };

  const isOwnProfile = UserLoginId && target_userId && String(UserLoginId) === String(target_userId);
  if (!target_userId || isOwnProfile) return null;

  return (
    <>
      <button
        type="button"
        disabled={isLoading}
        aria-label={`${buttonLabel} user`}
        onClick={handlePostFollowReq}
        className={
          isProfileVariant
            ? `inline-flex h-11 min-w-[118px] items-center justify-center rounded-xl px-5 text-sm font-semibold shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-wait disabled:opacity-60 ${profileButtonStateClass}`
            : isSuggestionVariant
              ? `inline-flex h-8 min-w-[74px] items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-wait disabled:opacity-60 ${buttonLabel === "Following" || buttonLabel === "Request" || buttonLabel === "Pending..." ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : "border border-transparent bg-[#fbba00] text-white hover:bg-[#e0a600]"}`
              : `rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-wait disabled:opacity-60 ${buttonLabel === "Following" ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : buttonLabel === "Request" || buttonLabel === "Pending..." ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" : "border border-transparent bg-[#fbba00] text-white hover:bg-[#e0a600]"}`
        }
      >
        {isLoading ? "..." : visibleButtonLabel}
      </button>

      {isActionModalOpen && (
        <FollowActionModal
          targetId={target_userId}
          status={selectedStatus}
          perspective="loginUser"
          onStatusChange={handleStatusChange}
          onClose={() => setIsActionModalOpen(false)}
        />
      )}
    </>
  );
};

export default Follow_button;
