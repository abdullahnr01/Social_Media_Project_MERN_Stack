import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get_user_connection_lists } from "../API layer/user_follow_api"; 
import { FaTimes, FaUserCircle } from "react-icons/fa";

export const FollowListModal = ({
  userId,
  initialTab = "followers",
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState({ followers: [], following: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectionData = async () => {
      try {
        setLoading(true);

        const { success, response } = await get_user_connection_lists(userId);

        if (success) {
          setData({
            followers: response?.data?.followers || [],
            following: response?.data?.following || [],
          });
        }
      } catch (err) {
        console.error("Connection list fetch error:", err);
      } finally {
        // ✅ 3. Data aane par loading band karein
        setLoading(false);
      }
    };

    if (userId) {
      fetchConnectionData();
    }
  }, [userId]);

  // ✅ 4. Uncommented: Active tab ke mutabiq list select karein
  const currentList =
    activeTab === "followers" ? data.followers : data.following;

  // ✅ 5. User par click karne se profile open hogi
  const handleUserClick = (targetId) => {
    onClose();
    navigate(`/user_profile_posts?id=${targetId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-up">
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("followers")}
              className={`text-sm font-semibold pb-1 cursor-pointer transition-colors ${
                activeTab === "followers"
                  ? "border-b-2 border-[#fbba00] text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Followers ({data.followers.length})
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`text-sm font-semibold pb-1 cursor-pointer transition-colors ${
                activeTab === "following"
                  ? "border-b-2 border-[#fbba00] text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Following ({data.following.length})
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg"
          >
            <FaTimes />
          </button>
        </div>

        {/* User List Display */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Loading...
            </div>
          ) : currentList.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No {activeTab} yet
            </div>
          ) : (
            currentList.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.firstname}
                    className="w-11 h-11 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <FaUserCircle className="w-11 h-11 text-gray-400" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.firstname} {user.lastname}
                  </p>
                  {/* <p className="text-xs text-gray-400 truncate">
                    {user.user_bio || "No bio"}
                  </p> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};