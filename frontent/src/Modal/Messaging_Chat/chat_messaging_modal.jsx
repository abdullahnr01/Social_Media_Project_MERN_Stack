import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:9090");

//
import { user_live_chat_Post_API } from "../../API layer/user_live_chat_api";
import { UserContext } from "../../Context/context";
import { ChatHeader } from "./Chat_header";
import { ChatMessageList } from "./Chat_Message_Container/chat_message_list";

//
const Chat_Messaging_Modal = ({
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
        <ChatHeader user={receiverProfile} onClose={onclose} variant="modal" />

        <ChatMessageList
          messages={userChats}
          UserLoginId={UserLoginId}
          size="sm"
        />

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

export default Chat_Messaging_Modal;
