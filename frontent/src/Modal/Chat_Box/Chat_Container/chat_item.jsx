import React from "react";

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

export const ChatMessageItem = ({ msg, UserLoginId }) => {
  if (!msg) return null;
  const time = formatMessageTime(msg.createdAt);
  const senderId = msg.senderId || msg.sender;
  const isMe = String(senderId) === String(UserLoginId);

  return (
    <div className={`my-0.5 flex w-full flex-col px-1 ${isMe ? "items-end" : "items-start"}`}>
      <div className={`flex max-w-[82%] flex-col ${isMe ? "items-end" : "items-start"} sm:max-w-[72%]`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm font-normal leading-relaxed whitespace-pre-wrap shadow-sm ${
            isMe
              ? "rounded-br-md bg-gradient-to-br from-[#fbba00] to-amber-500 text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
          }`}
          style={{ overflowWrap: "anywhere" }}
        >
          {msg.text}
        </div>
        {time && (
          <span className="mt-1 select-none px-1 text-[10px] font-medium text-slate-400">
            {time}
          </span>
        )}
        {msg.status === "failed" && (
          <span className="mt-1 px-1 text-[10px] font-medium text-red-500">Not sent</span>
        )}
      </div>
    </div>
  );
};
