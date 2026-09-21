import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:9090");

//
import { user_live_chat_Post_API } from "../../../../../API layer/user_live_chat_api";
import { UserContext } from "../../../../../Context/context";

//
const Livechat_modal = ({
  onclose,
  receiverId,
  conversionId,
  receiverProfile,
}) => {
  //  Context
  const { UserInfo, userPostsProfile, userChats, setUserChats } =
    useContext(UserContext);

  //
  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [userChats]);
  //
  const UserLoginId = UserInfo._id;

  //
  const navigate = useNavigate();

  // usestates ---------------
  const [message, setMessage] = useState("");

  // Useeffect
  useEffect(() => {
    if (!conversionId) return;
    if (conversionId) {
      socket.emit("joinChatRoom", conversionId);

      socket.on("receiveMessage", (newMessage) => {
        setUserChats((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [conversionId]);

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
      // setUserChats((prev) => [...prev, response?.data?.data]);
    }
  };

  return (
    <>
      <div className="fixed bottom-12 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col">
        {/* Header */}
        <div className="bg-[#fbba00] text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 ">
            <img
              src={receiverProfile.image}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold text-lg">
              {receiverProfile.firstname} {receiverProfile.lastname}
            </span>
          </div>
          <button
            onClick={() => onclose(false)}
            className="text-white text-2xl font-bold hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* Messages Section */}
        {/* <div className="flex-1 px-4 py-3 space-y-2 bg-gray-50 h-64 overflow-y-auto">
          {userChats.map((msg, index) => {
            // Format time
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const senderId =
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId;

            const isMeLogin = senderId === UserLoginId;

            return (
              <div
                key={index}
                className={`flex ${isMeLogin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="flex flex-col"
                  style={{
                    alignItems: isMeLogin ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      isMeLogin
                        ? "bg-[#fbba00] text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span
                    className="text-xs text-gray-500 mt-1"
                    style={{
                      textAlign: isMeLogin ? "right" : "left",
                    }}
                  >
                    {time}
                  </span>
                </div>
              </div>
            );
          })}
        </div> */}

        <div
          ref={chatRef}
          className="flex-1 px-4 py-3 space-y-2 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        >
          {userChats.map((msg, index) => {
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const senderId =
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId;
            const isMeLogin = senderId === UserLoginId;

            return (
              <div
                key={index}
                className={`flex ${isMeLogin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="flex flex-col"
                  style={{
                    alignItems: isMeLogin ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      isMeLogin
                        ? "bg-[#fbba00] text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span
                    className="text-xs text-gray-500 mt-1"
                    style={{ textAlign: isMeLogin ? "right" : "left" }}
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
