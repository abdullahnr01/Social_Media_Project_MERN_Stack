import React, { useEffect, useRef } from "react";
import { ChatMessageItem } from "./chat_item";

export const ChatMessageList = ({ messages = [], UserLoginId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-2 py-4 space-y-3 bg-slate-50 border-x border-slate-100 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      {messages.length > 0 ? (
        <>
          {messages.map((msg, index) => (
            <ChatMessageItem
              key={msg._id || index}
              msg={msg}
              UserLoginId={UserLoginId}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-slate-400 font-medium text-sm space-y-1 select-none">
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-1 text-xl shadow-sm">
            💬
          </div>
          <p>No messages yet.</p>
        </div>
      )}
    </div>
  );
};
