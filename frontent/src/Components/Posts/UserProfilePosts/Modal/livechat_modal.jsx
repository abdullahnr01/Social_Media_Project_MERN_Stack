import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { user_live_chat_Post_API } from "../../../../API layer/user_live_chat_api";
import { UserContext } from "../../../../Context/context";

const Livechat_modal = ({ onclose, receiverId }) => {
  //  Context
  const { UserInfo, userPostsProfile, userChats, setUserChats } =
    useContext(UserContext);
  const UserLoginId = UserInfo._id;
  const targetuserId = userPostsProfile._id;

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(userChats);
  }, [userChats]);

  const handleSendMessage = async () => {
    const { success, response, status } = await user_live_chat_Post_API(
      receiverId,
      message,
    );

    if (status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }

    if (success) {
      setMessage("");
      setUserChats((prev) => [...prev, response?.data?.data]);
    }
  };

  return (
    <>
      <div className="fixed bottom-12 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col">
        {/* Header */}
        <div className="bg-[#fbba00] text-white px-4 py-3 flex justify-between items-center">
          <span className="font-semibold text-lg">Live Chat</span>
          <button
            onClick={() => onclose(false)}
            className="text-white text-xl font-bold hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* Messages Section */}
        <div className="flex-1 px-4 py-3 space-y-2 bg-gray-50 h-64 overflow-y-auto">
          {userChats.map((msg, index) => {
            // Format time
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={index}
                className={`flex ${msg.senderId === UserLoginId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="flex flex-col"
                  style={{
                    alignItems:
                      msg.senderId === UserLoginId ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      msg.senderId === UserLoginId
                        ? "bg-[#fbba00] text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span
                    className="text-xs text-gray-500 mt-1"
                    style={{
                      textAlign:
                        msg.senderId === UserLoginId ? "right" : "left",
                    }}
                  >
                    {time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Section */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fbba00]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()} // disable if message is empty or spaces
            className={`px-4 py-2 rounded-full transition-colors duration-200 
    ${
      message.trim()
        ? "bg-[#fbba00] text-white hover:bg-[#e0a800] cursor-pointer" // enabled style
        : "bg-gray-300 text-gray-500 cursor-not-allowed" // disabled style
    }`}
          >
            {message.trim() ? "Send" : "Send"} {/* optional disabled icon */}
          </button>
        </div>
      </div>
    </>
  );
};

export default Livechat_modal;
