import React, { useEffect, useRef } from "react";
import { ChatMessageItem } from "./ChatMessageItem";

export const ChatMessageList = ({
  messages = [],
  currentUserId,
  containerClass = "flex-1 px-4 py-3 space-y-2 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200",
  myBubbleClass,
  otherBubbleClass,
}) => {
  const chatRef = useRef(null);

  // Auto-scroll to bottom jab bhi naye messages aayen
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatRef} className={containerClass}>
      {messages.map((msg, index) => (
        <ChatMessageItem
          key={msg._id || index}
          msg={msg}
          currentUserId={currentUserId}
          myBubbleClass={myBubbleClass}
          otherBubbleClass={otherBubbleClass}
        />
      ))}
    </div>
  );
};