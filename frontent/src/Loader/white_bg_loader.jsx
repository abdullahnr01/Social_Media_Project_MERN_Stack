import React from "react";

export const WhiteScreenLoader = ({ message = "Loading your feed..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
      {/* Brand Glowing Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Glow */}
        <div className="absolute w-20 h-20 rounded-full bg-[#fbba00]/20 animate-ping" />

        {/* Outer Rotating Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#fbba00] animate-spin" />

        {/* Center Dot / Icon */}
        <div className="absolute w-6 h-6 rounded-full bg-[#fbba00] shadow-md shadow-[#fbba00]/50" />
      </div>

      {/* App Name & Message */}
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-xl font-bold tracking-wider text-gray-800">
          Social<span className="text-[#fbba00]">First</span>
        </h2>
        <p className="text-xs font-medium text-gray-400 mt-1 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};