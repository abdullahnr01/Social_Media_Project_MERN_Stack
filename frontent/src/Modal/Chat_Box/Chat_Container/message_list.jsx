import React, { useEffect, useRef } from "react";
import { ChatMessageItem } from "./message_item";

const emptyTextStyles = {
  sm: "text-xs",
  lg: "text-base font-medium",
};

export const ChatMessageList = ({
  messages = [],
  UserLoginId,
  size = "sm",
  className = "",
}) => {
  const chatRef = useRef(null);

  // Auto scroll to bottom jab bhi messages update ho
  useEffect(() => {
    if (chatRef.current) {
      // requestAnimationFrame ensured execution after DOM update
      requestAnimationFrame(() => {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth", // Smooth scroll effect ke liye
        });
      });
    }
  }, [messages]);

  const currentEmptyStyle = emptyTextStyles[size] || emptyTextStyles.sm;

  return (
    <div
      ref={chatRef}
      className={`flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${className}`}
    >
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <ChatMessageItem
            key={msg._id || index}
            msg={msg}
            UserLoginId={UserLoginId}
            size={size}
          />
        ))
      ) : (
        <div
          className={`h-full flex items-center justify-center text-gray-400 ${currentEmptyStyle}`}
        >
          No messages yet.
        </div>
      )}
    </div>
  );
};