import React from "react";
import { Paperclip, Image as ImageIcon, Smile, Send, Mic } from "lucide-react";

export const Msg_Input = ({ message, setMessage, onSendMessage, onAttachFile, onSelectImage, onSelectEmoji }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage();
    }
  };

  const isMessageTyped = Boolean(message.trim());

  return (
    <form
      onSubmit={handleSend}
      className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-1.5 w-full shadow-sm"
    >
      {/* 1. Pin Icon */}
      <button
        type="button"
        onClick={onAttachFile}
        aria-label="Attach file"
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 flex-shrink-0 cursor-pointer"
      >
        <Paperclip size={20} />
      </button>

      {/* 2. Image Icon */}
      <button
        type="button"
        onClick={onSelectImage}
        aria-label="Attach image"
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 flex-shrink-0 cursor-pointer"
      >
        <ImageIcon size={20} />
      </button>

      {/* 3. Text Input Bar */}
      <div className="flex-1 min-w-0 mx-1">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#fbba00] focus:ring-2 focus:ring-[#fbba00]/60 focus:bg-white transition-all duration-200"
        />
      </div>

      {/* 4. Emoji Icon */}
      <button
        type="button"
        onClick={onSelectEmoji}
        aria-label="Add emoji"
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 flex-shrink-0 cursor-pointer"
      >
        <Smile size={20} />
      </button>

      {/* 5. Dynamic Action Button (Mic / Send) */}
      <button
        type={isMessageTyped ? "submit" : "button"}
        disabled={!isMessageTyped}
        aria-label={isMessageTyped ? "Send message" : "Voice recording disabled"}
        className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
          isMessageTyped
            ? "bg-[#fbba00] text-white hover:bg-[#e0a800] shadow-md shadow-[#fbba00]/25 cursor-pointer active:scale-95"
            : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-80"
        }`}
      >
        {isMessageTyped ? (
          <Send size={18} className="translate-x-0.5" />
        ) : (
          <Mic size={18} />
        )}
      </button>
    </form>
  );
};

