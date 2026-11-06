import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilePlus2,
  LogOut,
  Pencil,
  Settings,
  UserRound,
} from "lucide-react";

export const Nav_User_Profile_Btn = ({ UserInfo }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fullName = `${UserInfo?.firstname || ""} ${UserInfo?.lastname || ""}`.trim() || "Your account";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleGoToMyPosts = () => {
    navigate(`/user_profile_posts?id=${UserInfo?._id}`);
    setDropdownOpen(false);
  };

  const handleCreatePost = () => {
    navigate("/create-post");
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  const menuItemClass = "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        onClick={() => setDropdownOpen((open) => !open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {UserInfo?.image ? (
          <img
            src={UserInfo.image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white">
            <UserRound size={22} aria-hidden="true" />
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-[calc(100%+12px)] z-[70] w-72 max-w-[calc(100vw-1.5rem)] origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.2)] ring-1 ring-black/5"
        >
          <div className="bg-gradient-to-br from-amber-50 via-white to-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
                {UserInfo?.image ? (
                  <img
                    src={UserInfo.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserRound size={26} className="text-amber-600" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{fullName}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {UserInfo?.email || "Manage your account"}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate("/edit-profile");
                setDropdownOpen(false);
              }}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#fbba00] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e0a600] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
            >
              <Pencil size={15} aria-hidden="true" />
              Edit profile
            </button>
          </div>

          <div className="border-t border-slate-100 p-2">
            <button type="button" role="menuitem" className={menuItemClass} onClick={handleGoToMyPosts}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-amber-100 group-hover:text-amber-700">
                <UserRound size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">My profile</span>
              </span>
            </button>
            <button type="button" role="menuitem" className={menuItemClass} onClick={handleCreatePost}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-amber-100 group-hover:text-amber-700">
                <FilePlus2 size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">Create post</span>
              </span>
            </button>
            <button
              type="button"
              role="menuitem"
              className={menuItemClass}
              onClick={() => setDropdownOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-amber-100 group-hover:text-amber-700">
                <Settings size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">Settings</span>
              </span>
            </button>
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-100">
                <LogOut size={17} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-rose-700">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
