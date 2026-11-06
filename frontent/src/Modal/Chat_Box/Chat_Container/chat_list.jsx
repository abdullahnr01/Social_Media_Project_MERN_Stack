import React, { useLayoutEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { ChatMessageItem } from "./chat_item";
import { formatMessageDateSeparator } from "../../../Utils/chat_date_formatter";

export const ChatMessageList = ({ messages = [], UserLoginId }) => {
  const messageContainerRef = useRef(null);

  useLayoutEffect(() => {
    const container = messageContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      ref={messageContainerRef}
      className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 px-3 py-5 sm:px-4"
    >
      {messages.length > 0 ? (
        <>
          <div className="space-y-2.5">
            {messages.map((message, index) => {
              const currentDate = formatMessageDateSeparator(message.createdAt);
              const previousDate = index > 0
                ? formatMessageDateSeparator(messages[index - 1]?.createdAt)
                : null;
              const showDate = currentDate && currentDate !== previousDate;

              return (
                <React.Fragment key={message._id || index}>
                  {showDate && (
                    <div className="my-4 flex justify-center select-none">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-500 shadow-sm">
                        {currentDate}
                      </span>
                    </div>
                  )}
                  <ChatMessageItem msg={message} UserLoginId={UserLoginId} />
                </React.Fragment>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex h-full min-h-[250px] flex-col items-center justify-center space-y-2 text-sm font-medium text-slate-400 select-none">
          <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-amber-500 shadow-sm">
            <MessageCircle size={25} aria-hidden="true" />
          </div>
          <p>No messages yet</p>
          <p className="text-xs font-normal">Say hello to start the conversation.</p>
        </div>
      )}
    </div>
  );
};
