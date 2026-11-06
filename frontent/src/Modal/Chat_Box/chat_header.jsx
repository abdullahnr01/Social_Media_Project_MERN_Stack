import React from "react";
import { MessageCircle, X } from "lucide-react";

export const ChatHeader = ({ user, onClose }) => {
  const name = `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || "User";

  return (
    <header className="relative flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#fbba00] via-amber-400 to-orange-300" />
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          {user?.image ? (
            <img
              src={user.image}
              alt={`${name}'s profile`}
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <MessageCircle size={21} aria-hidden="true" />
            </span>
          )}
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${user?.online ? "bg-emerald-500" : "bg-slate-300"}`} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900">{name}</h2>
          <p className={`mt-0.5 flex items-center gap-1.5 text-xs ${user?.online ? "text-emerald-600" : "text-slate-500"}`}>
            {user?.online ? "Active now" : "Offline"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onClose?.(false)}
        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label="Close chat"
      >
        <X size={19} aria-hidden="true" />
      </button>
    </header>
  );
};
