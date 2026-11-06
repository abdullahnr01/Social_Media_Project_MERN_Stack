import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Search, MoreVertical, Image as ImageIcon } from "lucide-react";
import io from "socket.io-client";
const socket = io("http://localhost:9090");
import { UserContext } from "../Context/context";

// API Import

import {
  user_get_all_conversion_API,
  get_all_message_API,
  mark_read_conversation_patch_API,
  user_live_chat_Post_API,
} from "../API layer/user_live_chat_api";

// Components Import
import { Msg_Header } from "../Components/Messaging/Msg_Header/info_header";
import { Action_Header } from "../Components/Messaging/Msg_Header/action_header";
import { Msg_List } from "../Components/Messaging/Msg_Container/msg_list";
import { Msg_Input } from "../Components/Messaging/Msg_Input_Bar/msg_input";
import { WhiteScreenLoader } from "../Loader/white_bg_loader";
import { formatConversationTime } from "../Utils/chat_date_formatter";

function UserAllMessaging() {
  const [loading, setLoading] = useState(true);

  const { UserInfo } = useContext(UserContext);

  // is state me saree users ki chat a rahi hai jo left side pr ati hai
  const [conversations, setConversations] = useState([]);

  // specific chat k click krne pr us user ki info a rahi hai , name , online
  const [activeChat, setActiveChat] = useState(null);

  const [markRead, setmarkRead] = useState("");

  // specific chat k click , left side wali chat ane pr us chat k msg is state me a rae hain
  const [userChats, setUserChats] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const UserLoginId = UserInfo?._id;
  const receiverId = activeChat?.opponentId; // ye tergetUser id hai

  useEffect(() => {
    console.log(activeChat);
  }, [activeChat]);

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  // 1. Backend se saari conversations fetch karna
  const FetchAllConversations = useCallback(async (showLoader = true) => {
    if (!UserLoginId) return;
    try {
      if (showLoader) setLoading(true);
      const res = await user_get_all_conversion_API();

      if (res.success && res.response?.data?.data) {
        // Raw backend data ko aapke UI state format mein map karna:
        const formattedData = res.response?.data?.data.map((chat) => {
          // Participants array mein se opposite user find karein
          const opponent =
            chat.participants.find((user) => user._id !== UserLoginId) || {};

          // WhatsApp style Date / Time formatting (Today -> 10:30 AM, Yesterday -> Yesterday, Days -> Mon, Older -> 04/11/26)
          const messageTime = chat.lastMessage?.createdAt
            ? formatConversationTime(chat.lastMessage.createdAt)
            : "";

          return {
            id: chat._id, // ye conversion docs ki id hai
            firstname: opponent?.firstname?.trim() || "User",
            lastname: opponent?.lastname?.trim() || "",
            image: opponent.image || "https://via.placeholder.com/120",
            lastMessage: chat.lastMessage?.text || "No messages yet",
            time: messageTime,
            unread: chat.unreadCount || 0,
            online: opponent.isOnline || false,
            lastSeen: opponent.lastSeen,
            opponentId: opponent._id, // ye target user ki id hai
          };
        });

        setConversations(formattedData);
      }
    } catch (error) {
      console.error("Error formatting conversation data:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [UserLoginId]);

  // 2. Component Mount hone par API call
  useEffect(() => {
    FetchAllConversations();
  }, [FetchAllConversations]);

  // 3. Socket Listener - Left Side aur Right Side dono live update
  useEffect(() => {
    if (UserInfo?._id) {
      socket.emit("joinUserRoom", UserInfo._id);

      socket.on("receiveMessage", (incomingMessage) => {
        const senderId = incomingMessage.senderId || incomingMessage.sender;
        const isChatOpen = activeChatRef.current?.opponentId === senderId;

        // 1. Agar samne chat open hai to Right Side (userChats) me message push karo
        if (isChatOpen) {
          setUserChats((prevMessages) => [...prevMessages, incomingMessage]);
        }

        // 2. Left side conversation list ko live update karo
        setConversations((prevList) => {
          const chatIndex = prevList.findIndex(
            (c) =>
              c.opponentId === senderId ||
              (incomingMessage.conversationId && c.id === incomingMessage.conversationId)
          );

          const currentTime = formatConversationTime(
            incomingMessage.createdAt || new Date()
          );

          if (chatIndex !== -1) {
            const targetChat = prevList[chatIndex];

            const updatedChat = {
              ...targetChat,
              lastMessage: incomingMessage.text,
              time: currentTime,
              // Agar chat open hai to unread 0, warna +1
              unread: isChatOpen ? 0 : (targetChat.unread || 0) + 1,
            };

            const remainingChats = prevList.filter((_, idx) => idx !== chatIndex);
            return [updatedChat, ...remainingChats];
          } else {
            // Naya user hai jo pehle list me nahi tha
            FetchAllConversations(false);
            return prevList;
          }
        });
      });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [UserInfo?._id, FetchAllConversations]);

  // ye us specific person ki info or chat la raha hai
  const handleSelectChat = async (chat) => {
    if (!chat) {
      return;
    }

    setActiveChat(chat);

    setConversations((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((c) => c.id === chat.id);

      if (index !== -1) {
        updated[index] = { ...updated[index], unread: 0 };
      }
      return updated;
    });

    if (chat.opponentId) {
      const { success, response, status } = await get_all_message_API(
        chat.opponentId,
      );

      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (success) {
        setUserChats(response?.data?.data || []);
      }
    }

    if (chat.id && chat.unread > 0) {
      await mark_read_conversation_patch_API(chat.id);
    }
  };

  // Handle message send
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

    // Sender ki apni left sidebar list ko bhi live update aur top par karein
    setConversations((prev) => {
      const index = prev.findIndex((c) => c.opponentId === receiverId);
      if (index === -1) return prev;

      const updatedChat = {
        ...prev[index],
        lastMessage: currentText,
        time: formatConversationTime(new Date()),
      };

      const remaining = prev.filter((_, idx) => idx !== index);
      return [updatedChat, ...remaining];
    });

    try {
      const { success, response, status } = await user_live_chat_Post_API(
        receiverId,
        currentText,
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

  if (loading) {
    // return <WhiteScreenLoader message="Loading your messages..." />;
  }

  return (
    <div className="flex justify-center items-start bg-slate-100 pt-4 pb-6 px-2 sm:px-6">
      {/* Inside Main Container Box - height thodi aur adjust kar lein */}
      <div className="w-full max-w-5xl h-[calc(100vh-100px)] bg-white rounded-2xl shadow-xl border border-slate-200 flex overflow-hidden">
        {/* ================= LEFT SIDEBAR: Conversations List ================= */}
        <div className="w-full md:w-1/3 lg:w-2/5 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <h1 className="text-xl font-bold text-slate-800">Messages</h1>
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 bg-white border-b border-slate-100">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition hover:bg-slate-100/80 ${
                  activeChat?.id === chat.id
                    ? "bg-blue-50/80 border-l-4 border-[#fbba00]"
                    : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.image}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">
                      {`${chat.firstname || ""} ${chat.lastname || ""}`.trim() ||
                        "User"}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {chat.unread > 0 && (
                  <span className="bg-[#fbba00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE: Active Chat Box ================= */}
        {activeChat ? (
          <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden bg-white">
            {/* Active Chat Header - Fixed Top */}
            <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white/95 backdrop-blur-md z-10">
              <Msg_Header user={activeChat} />
              <Action_Header />
            </div>

            <Msg_List messages={userChats} UserLoginId={UserLoginId} />

            <Msg_Input
              message={messageInput}
              setMessage={setMessageInput}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/50 text-slate-400 font-medium">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-3 text-3xl">
              ✉️
            </div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAllMessaging;