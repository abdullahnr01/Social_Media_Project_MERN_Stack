import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../Socket/socket_io";
import {
  mark_read_conversation_patch_API,
  user_live_chat_Post_API,
} from "../../API layer/user_live_chat_api";
import { UserContext } from "../../Context/context";
import { ChatHeader } from "./chat_header";
import { ChatMessageList } from "./Chat_Container/chat_list";
import ChatInput from "./chat_input";

const Chat_Messaging_Modal = ({
  userChats,
  setUserChats,
  onclose,
  receiverId,
  conversationId,
  receiverProfile,
  isLoading = false,
}) => {
  const { UserInfo } = useContext(UserContext);
  const UserLoginId = UserInfo?._id;
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const handleIncomingMessage = (incomingMessage) => {
      const senderId = incomingMessage.senderId || incomingMessage.sender;
      if (String(senderId) !== String(receiverId)) return;
      setUserChats((previous) => [...previous, incomingMessage]);
      const incomingConversationId = incomingMessage.conversationId || conversationId;
      if (incomingConversationId) {
        mark_read_conversation_patch_API(incomingConversationId);
      }
    };

    socket.on("receiveMessage", handleIncomingMessage);
    return () => socket.off("receiveMessage", handleIncomingMessage);
  }, [conversationId, receiverId, setUserChats]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onclose(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onclose]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !receiverId) return;

    const currentText = messageInput.trim();
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
    setUserChats((previous) => [...previous, tempMessage]);

    try {
      const result = await user_live_chat_Post_API(receiverId, currentText);
      if (result?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (result?.success && result.response?.data?.data) {
        const savedMessage = result.response.data.data;
        setUserChats((previous) =>
          previous.map((message) => (message._id === tempId ? savedMessage : message)),
        );
      } else {
        setUserChats((previous) =>
          previous.map((message) =>
            message._id === tempId ? { ...message, status: "failed" } : message,
          ),
        );
      }
    } catch (error) {
      console.error("Chat modal send error:", error);
      setUserChats((previous) =>
        previous.map((message) =>
          message._id === tempId ? { ...message, status: "failed" } : message,
        ),
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onclose(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Chat with ${receiverProfile?.firstname || "user"}`}
        className="flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl sm:h-[min(700px,calc(100dvh-2.5rem))] sm:rounded-3xl sm:ring-1 sm:ring-black/10"
      >
        <ChatHeader user={receiverProfile} onClose={onclose} />

        <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
          {isLoading ? (
            <div className="flex flex-1 flex-col justify-end gap-4 overflow-hidden px-5 py-6">
              <div className="h-10 w-2/3 animate-pulse self-start rounded-2xl bg-slate-200" />
              <div className="h-12 w-3/5 animate-pulse self-end rounded-2xl bg-amber-100" />
              <div className="h-9 w-1/2 animate-pulse self-start rounded-2xl bg-slate-200" />
            </div>
          ) : (
            <ChatMessageList messages={userChats} UserLoginId={UserLoginId} />
          )}
        </div>

        <ChatInput
          message={messageInput}
          setMessage={setMessageInput}
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </section>
    </div>
  );
};

export default Chat_Messaging_Modal;
