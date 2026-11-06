import React, { useEffect, useRef } from "react";
import { ChatMessageItem } from "./chat_item";
import { formatMessageDateSeparator } from "../../../Utils/chat_date_formatter";

export const ChatMessageList = ({ messages = [], UserLoginId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-2 py-4 space-y-3 bg-slate-50 border-x border-slate-100 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      {messages.length > 0 ? (
        <>
          {messages.map((msg, index) => {
            const currentDateLabel = formatMessageDateSeparator(msg.createdAt);
            const prevDateLabel =
              index > 0 ? formatMessageDateSeparator(messages[index - 1]?.createdAt) : null;
            const showDateSeparator = currentDateLabel && currentDateLabel !== prevDateLabel;

            return (
              <React.Fragment key={msg._id || index}>
                {showDateSeparator && (
                  <div className="flex justify-center my-2 select-none">
                    <span className="bg-white border border-slate-200/80 text-slate-500 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                      {currentDateLabel}
                    </span>
                  </div>
                )}
                <ChatMessageItem
                  msg={msg}
                  UserLoginId={UserLoginId}
                />
              </React.Fragment>
            );
          })}
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
