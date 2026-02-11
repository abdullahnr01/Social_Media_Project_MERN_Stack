import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaHome,
  FaPlusSquare,
} from "react-icons/fa";
import { UserContext } from "../Context/context";

import { get_user_notification } from "../API layer/api";

import { respond_user_follow_click } from "../API layer/user_follow_api";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [request, setRequest] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  //
  const {
    UserInfo,
    // function
    UserInfofetch,
  } = useContext(UserContext);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  useEffect(() => {
    UserInfofetch();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // functions -------------------------

  const handleGoToMyPosts = () => {
    navigate("/my-posts");
  };
  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //
  const handleGetAllNotification = async (targetId) => {
    const { success, response, status } = await get_user_notification(targetId);
    if (success) {
      const data = response?.data?.data;
      setRequest(data);
    }
  };

  const respondFollowReq = async (targetId, action) => {
    const { success, response, status } = await respond_user_follow_click(
      targetId,
      action,
    );
    if (success) {
      setRemovingId(targetId);

      setTimeout(() => {
        setRequest((prev) =>
          prev.filter((req) => req.loginUser._id !== targetId),
        );
        setRemovingId(null);
      }, 300);
    }
  };

  return (
    <nav className="bg-[#fbba00] shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-16 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left 50% */}
          <div className="flex w-1/2 items-center">
            <h1 className="text-2xl font-bold text-white cursor-pointer ml-[1%]">
              SocialFirst
            </h1>

            <div className="flex ml-[20%] space-x-[35%]">
              {/* Feed */}
              <div
                onClick={() => navigate("/home")}
                className="flex flex-col items-center cursor-pointer hover:text-gray-100 transition-colors"
              >
                <FaHome className="text-white text-xl" />
                <span className="text-white text-xs mt-1 font-medium">
                  Home
                </span>
              </div>

              {/* Post */}
              <div
                onClick={() => navigate("/create-post")}
                className="flex flex-col items-center cursor-pointer hover:text-gray-100 transition-colors"
              >
                <FaPlusSquare className="text-white text-xl" />
                <span className="text-white text-xs mt-1 font-medium whitespace-nowrap">
                  Create Post
                </span>
              </div>
            </div>
          </div>

          {/* Right 50% */}
          <div className="flex w-1/2 items-center justify-center space-x-6">
            {/* Search Bar */}
            <div className="relative max-w-lg flex-1">
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full px-4 py-2 pl-10 border border-white bg-white bg-opacity-20 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black opacity-80" />
            </div>

            {/* Notification */}
            <FaBell
              className="text-white text-xl cursor-pointer hover:text-gray-100 transition-colors"
              onClick={() => {
                (setOpenNotification(!openNotification),
                  handleGetAllNotification());
              }}
            />

            {openNotification && (
              <div className="absolute top-11 right-5 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-80">
                {request.length > 0 ? (
                  request.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 border-b border-gray-100 transition-all duration-300 ${
                        removingId === item.loginUser._id
                          ? "translate-x-[150%] opacity-0"
                          : "translate-x-0 opacity-100"
                      }`}
                    >
                      {/* Row 1: Image + Name (Left), Time (Right) */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.loginUser.image}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {item.loginUser.firstname}{" "}
                              {item.loginUser.lastname}
                            </p>
                            <p className="text-xs text-gray-500">
                              sent you a follow request
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Row 2: Message */}

                      {/* Row 3: Buttons */}
                      <div className="flex gap-2 mt-3 ml-12">
                        <button
                          className="px-4 py-1.5 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 shadow-sm transition-all"
                          onClick={() => {
                            respondFollowReq(item?.loginUser?._id, "accepted");
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-1.5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 shadow-sm transition-all"
                          onClick={() => {
                            respondFollowReq(item?.loginUser?._id, "rejected");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-5 text-sm text-gray-500 ">
                    No new notifications
                  </p>
                )}
              </div>
            )}

            {/* Profile */}

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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
