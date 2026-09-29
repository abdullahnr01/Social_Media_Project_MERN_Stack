import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:9090");

//
import { user_live_chat_Post_API } from "../../API layer/user_live_chat_api";
import { UserContext } from "../../Context/context";
import { ChatHeader } from "./Chat_header";
import { ChatMessageList } from "./Chat_Container/chat_list";
import ChatInput from "./chat_input";

//
const Chat_Messaging_Modal = ({
  userChats,
  setUserChats,
  onclose,
  receiverId,
  receiverProfile,
}) => {

  //  Context
  const { UserInfo } = useContext(UserContext);

  //
  const UserLoginId = UserInfo._id;

  //
  const navigate = useNavigate();

  // usestates ---------------
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (UserInfo?._id) {
      socket.emit("joinUserRoom", UserInfo._id);

      socket.on("receiveMessage", (incomingMessage) => {
        setUserChats((prevMessages) => [...prevMessages, incomingMessage]);
      });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [UserInfo?._id]);

  useEffect(() => {
    console.log(receiverProfile);
  }, [receiverProfile]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !receiverId) return;

    const currentText = messageInput;
    setMessageInput("");

    const tempId = `temp_${Date.now()}`;

    const tempMessage = {
      _id: tempId,
      sender: UserLoginId,
      receiver: receiverId,
      text: currentText,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setUserChats((prev) => [...prev, tempMessage]);

    try {
      const { success, response, status } = await user_live_chat_Post_API(
        receiverId,
        messageInput,
      );

      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      if (success && response?.data?.data) {
        const real_db_Msg = response.data.data;
        setUserChats((prev) =>
          prev.map((m) => (m._id === tempId ? real_db_Msg : m)),
        );
      }
    } catch (err) {
      console.log(err);
      setUserChats((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m)),
      );
    }
  };
  return (
    <>
      <div className="fixed bottom-12 right-6 w-80 md:w-96 h-[450px] bg-gray-50 rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
        <ChatHeader user={receiverProfile} onClose={onclose}  />

        <div className="flex flex-col  h-full max-h-[70vh] sm:max-h-[300px]">
          <div className="flex-1 overflow-y-auto  min-h-0">
            <ChatMessageList
              messages={userChats}
              UserLoginId={UserLoginId}
              size="sm"
            />
          </div>
        </div>

        <ChatInput
          message={messageInput}
          setMessage={setMessageInput}
          onSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
};

export default Chat_Messaging_Modal;
