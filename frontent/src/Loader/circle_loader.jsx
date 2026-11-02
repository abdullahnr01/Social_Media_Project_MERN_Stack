import React from "react";

export const CircleLoader = ({ text = "ufpwf", size = "md" }) => {
  // Size mapping
  const sizeMap = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-[3px]",
    lg: "w-16 h-16 border-4",
  };

  return (
    // 🎯 Fixed Inset-0: Screen ke center mein + 100% Transparent + Clicks Blocked
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent select-none cursor-wait">
      {/* Center Transparent Circle Spinner */}
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-gray-300/40 border-t-[#fbba00] animate-spin`}
      />

      {/* Optional Text */}
      {text && (
    <span className="mt-3 text-xs font-semibold text-gray-800 bg-white px-4 py-1 rounded-full border border-gray-400 shadow-sm">
  {text}
</span>
      )}
    </div>
  );
};