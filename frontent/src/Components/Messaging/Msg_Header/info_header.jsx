import React from "react";

export const Msg_Header = ({ user }) => {
  console.log(user);

  const name =
    `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || "User";
  const image = user?.image || "/default-avatar.png";

  return (
    <div
      className={`px-4 py-3 flex justify-between items-center bg-white text-slate-800`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className={`w-10 h-10 rounded-full object-cover`}
          />
          {user?.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <h2 className={`font-semibold text-sm"`}>{name}</h2>

          <p className={`text-xs text-slate-400`}>
            {user?.online ? "Active now" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};
