import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({ message, setMessage, onSendMessage, disabled = false }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && message.trim() && !disabled) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (message.trim() && !disabled) onSendMessage();
      }}
      className="flex shrink-0 items-center gap-2.5 border-t border-slate-200 bg-white px-3 py-3 sm:px-4"
    >
      <input
        type="text"
        aria-label="Write a message"
        placeholder="Write a message..."
        autoComplete="off"
        maxLength={2000}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        aria-label="Send message"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fbba00] text-white shadow-sm transition hover:bg-[#e0a600] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      >
        <Send size={18} aria-hidden="true" />
      </button>
    </form>
  );
};

export default ChatInput;
