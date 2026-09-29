import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPaperPlane, FaBell } from "react-icons/fa";

export const Nav_Actions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-1/2 items-center justify-between pr-2">
      {/* Left Navigation Icons (Home, Messaging, Notification) */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        {/* Home / Feed */}
        <div
          onClick={() => navigate("/home")}
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity select-none"
        >
          <FaHome className="text-white text-xl" />
          <span className="text-white text-xs mt-0.5 font-medium">Home</span>
        </div>

        {/* Messaging */}
        <div
          onClick={() => navigate("/messaging")}
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity select-none"
        >
          <FaPaperPlane className="text-white text-xl" />
          <span className="text-white text-xs mt-0.5 font-medium whitespace-nowrap">
            Messages
          </span>
        </div>

        {/* Notification */}
        <div
          onClick={() => navigate("/notifications")}
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity select-none"
        >
          <FaBell className="text-white text-xl" />
          <span className="text-white text-xs mt-0.5 font-medium whitespace-nowrap">
            Notification
          </span>
        </div>
      </div>
    </div>
  );
};