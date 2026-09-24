import React from "react";

const sizeStyles = {
  sm: {
    bubble: "max-w-[240px] px-3 py-1.5 text-sm",
    time: "text-[10px]",
  },
  lg: {
    bubble: "max-w-md px-4 py-2 text-sm",
    time: "text-xs",
  },
};

const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const ChatMessageItem = ({ msg, UserLoginId, size = "sm" }) => {
  if (!msg) return null;
  const time = formatMessageTime(msg.createdAt);
  const isMe = String(msg.senderId) === String(UserLoginId);
  const currentSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <div
      className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full`}
    >
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        {/* Chat Bubble */}
        <div
          className={`${currentSize.bubble} rounded-2xl break-words break-all whitespace-pre-wrap ${
            isMe
              ? "bg-[#fbba00] text-white rounded-br-none" // Sender: Yellow & Right
              : "bg-gray-200 text-slate-800 rounded-bl-none" // Receiver: Gray & Left
          }`}
        >
          {msg.text}
        </div>

        {/* Time Stamp */}
        {time && (
          <span className={`${currentSize.time} text-gray-400 mt-1 px-1`}>
            {time}
          </span>
        )}
      </div>
    </div>
  );
};
