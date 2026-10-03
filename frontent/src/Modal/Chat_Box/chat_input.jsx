import React from "react";

const ChatInput = ({ message, setMessage, onSendMessage }) => {
  // Enter key press par bhi send karne ka handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="px-4 py-5 border-t border-gray-200 flex items-center gap-2 w-full">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fbba00]"
      />
      <button
        onClick={onSendMessage}
        disabled={!message.trim()}
        className={`px-4 py-2 rounded-full transition-colors duration-200 ${
          message.trim()
            ? "bg-[#fbba00] text-white hover:bg-[#e0a800] cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;