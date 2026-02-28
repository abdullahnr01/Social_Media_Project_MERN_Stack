import React from "react";
import { FaShare } from "react-icons/fa";

const User_Share_Btn = () => {
  return (
    <>
      <button className="flex flex-col items-center group">
        <div className="flex items-center gap-2  group-hover:text-[#fbba00] transition-colors">
          <FaShare className="text-lg" />
        </div>
        <span className="text-xs text-gray-400 mt-1">Shares</span>
      </button>
    </>
  );
};

export default User_Share_Btn;
