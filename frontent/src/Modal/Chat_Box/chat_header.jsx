import React from "react";

export const ChatHeader = ({ user, onClose }) => {
  const name =
    `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || "User";
  const image = user?.image || "/default-avatar.png";

  return (
    <div className="px-4 py-3 flex justify-between items-center bg-white text-slate-800 border-b-2 border-[#fbba00] shadow-sm select-none">
      <div className="flex items-center gap-3">
        {/* Profile Image & Online Badge */}
        <div className="relative flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
          />
          {user?.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-500/20" />
          )}
        </div>

        {/* Name & Active Status */}
        <div>
          <h2 className="font-semibold text-sm text-slate-900 leading-tight">
            {name}
          </h2>
          <p
            className={`text-[11px] font-medium mt-0.5 ${
              user?.online ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {user?.online ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={() => onClose(false)}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all text-xl font-medium cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
};