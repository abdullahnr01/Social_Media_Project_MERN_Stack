import { useEffect, useState } from "react";
import { FaBellSlash } from "react-icons/fa";
import { get_user_notification } from "../API layer/api";

import { respond_user_follow_click } from "../API layer/user_follow_api";

// Static dummy data — backend se bhi isi format mein aayega
// const dummyRequests = [
//   {
//     _id: "1",
//     createdAt: new Date().toISOString(),
//     loginUser: {
//       _id: "u1",
//       firstname: "Ali",
//       lastname: "Khan",
//       image: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//   },
//   {
//     _id: "2",
//     createdAt: new Date(Date.now() - 3600000).toISOString(),
//     loginUser: {
//       _id: "u2",
//       firstname: "Sara",
//       lastname: "Ahmed",
//       image: "https://randomuser.me/api/portraits/women/44.jpg",
//     },
//   },
//   {
//     _id: "3",
//     createdAt: new Date(Date.now() - 7200000).toISOString(),
//     loginUser: {
//       _id: "u3",
//       firstname: "Bilal",
//       lastname: "Hassan",
//       image: "https://randomuser.me/api/portraits/men/65.jpg",
//     },
//   },
// ];

export const User_Notification = () => {
  const [request, setRequest] = useState([]);
  const [removingId, setRemovingId] = useState(null);


  const handleGetAllNotification = async (targetId) => {
    const { success, response, status } = await get_user_notification(targetId);
    console.log(response?.data);
    if (success) {
      const data = response?.data?.data;
      setRequest(data);
    }
  };

  useEffect(() => {
    handleGetAllNotification();
  }, []);


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
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Follow requests and updates
        </p>
      </div>

      {/* Notification List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {request.length > 0 ? (
          request.map((item) => (
            <div
              key={item._id}
              className={`p-5 border-b border-gray-100 last:border-none transition-all duration-300 ${
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
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.loginUser.firstname} {item.loginUser.lastname}
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

              {/* Row 2: Buttons */}
              <div className="flex gap-2 mt-3 ml-[60px]">
                <button
                  className="px-5 py-1.5 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 shadow-sm transition-all"
                  onClick={() =>
                    respondFollowReq(item?.loginUser?._id, "accepted")
                  }
                >
                  Accept
                </button>
                <button
                  className="px-5 py-1.5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 shadow-sm transition-all"
                  onClick={() =>
                    respondFollowReq(item?.loginUser?._id, "rejected")
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FaBellSlash className="text-4xl mb-3" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};
