import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export const Nav_User_Profile_Btn = ({ UserInfo }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoToMyPosts = () => {
    navigate(`/user_profile_posts?id=${UserInfo._id}`);
  };

  const HandleCreatePost = () => {
    navigate(`/create-post`);
  };

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile icon / image */}
        <button
          className="focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {UserInfo?.image ? (
            <img
              src={UserInfo.image}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer hover:opacity-90 transition"
            />
          ) : (
            <FaUserCircle className="text-white text-3xl cursor-pointer hover:text-gray-200 transition" />
          )}
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Profile section */}
            <div className="flex flex-col items-center p-4">
              <div className="w-20 h-20 relative">
                {UserInfo?.image ? (
                  <img
                    src={UserInfo.image}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition"
                    onClick={() => setDropdownOpen(false)}
                  />
                ) : (
                  <FaUserCircle className="text-[#fbba00] w-full h-full text-5xl cursor-pointer transition" />
                )}
              </div>

              <p className="mt-2 text-gray-800 font-semibold text-center break-words w-full">
                {UserInfo?.firstname || "User"}
              </p>
              <p className="text-gray-500 text-sm text-center break-words w-full">
                {UserInfo?.email || "example@mail.com"}
              </p>

              <button
                className="bg-[#fbba00] mt-3 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#e0a800] transition-all duration-200"
                onClick={() => {
                  navigate("/edit-profile");
                  setDropdownOpen(false);
                }}
              >
                Edit Profile
              </button>
            </div>

            {/* Menu items */}
            <div className="flex flex-col">
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-left w-full transition"
                onClick={() => {
                  handleGoToMyPosts();
                  setDropdownOpen(false);
                }}
              >
                My Posts
              </button>

              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-left w-full transition"
                onClick={() => {
                  HandleCreatePost();
                  setDropdownOpen(false);
                }}
              >
                Create Post
              </button>

              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-left w-full transition"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </button>

              <button
                className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white text-left w-full transition"
                onClick={() => {
                  handlelogout();
                  setDropdownOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
