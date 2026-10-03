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
  const isMe = String(msg.senderId) === String(UserLoginId);

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full my-0.5 px-1`}>
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%] sm:max-w-[65%]`}>
        {/* Chat Bubble */}
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm font-normal leading-relaxed whitespace-pre-wrap shadow-sm ${
            isMe
              ? "bg-[#fbba00] text-white rounded-br-none" 
              : "bg-white text-slate-800 rounded-bl-none border border-slate-200/80"
          }`}
          style={{
            wordBreak: "break-all",
            overflowWrap: "anywhere"
          }}
        >
          {msg.text}
        </div>

        {/* Time Stamp */}
        {time && (
          <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium select-none">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};