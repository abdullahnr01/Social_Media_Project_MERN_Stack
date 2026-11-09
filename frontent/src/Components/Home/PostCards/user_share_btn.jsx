import React from "react";
import { FaShare } from "react-icons/fa";

const User_Share_Btn = () => {
  return (
    <button
      type="button"
      className="flex min-w-20 flex-col items-center gap-1.5 rounded-lg py-1 text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      <FaShare className="text-lg" aria-hidden="true" />
      <span className="text-xs">Shares</span>
    </button>
  );
};

export default User_Share_Btn;
