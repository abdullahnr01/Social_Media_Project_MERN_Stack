import React, { useEffect, useRef } from "react";
import { MessageItem } from "./msg_item";
import { formatMessageDateSeparator } from "../../../Utils/chat_date_formatter";

export const Msg_List = ({ messages = [], UserLoginId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2 bg-slate-50 border-x border-gray-100">
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
                  <div className="flex justify-center my-3 select-none">
                    <span className="bg-white border border-slate-200 text-slate-500 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
                      {currentDateLabel}
                    </span>
                  </div>
                )}
                <MessageItem
                  msg={msg}
                  UserLoginId={UserLoginId}
                />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-gray-400 font-medium text-sm space-y-1">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            💬
          </div>
          <p>No messages yet.</p>
        </div>
      )}
    </div>
  );
};
