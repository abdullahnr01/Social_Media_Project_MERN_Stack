import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile,
} from "lucide-react";

import { UserContext } from "../Context/context";
import {
  user_get_all_conversion_API,
  get_all_message_API,
  mark_read_conversation_patch_API,
} from "../API layer/user_live_chat_api";
import { ChatHeader } from "../Modal/Messaging_Chat/Chat_header";
import { ChatMessageList } from "../Modal/Messaging_Chat/Chat_Message_Container/chat_message_list";

function UserAllMessaging() {
  const { UserInfo } = useContext(UserContext);

  const UserLoginId = UserInfo?._id;

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [markRead, setmarkRead] = useState("");

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  const FetchAllConversations = useCallback(async () => {
    if (!UserLoginId) return;
    try {
      const res = await user_get_all_conversion_API();

      console.log(res.response?.data?.data);

      if (res.success && res.response?.data?.data) {
        // Raw backend data ko aapke UI state format mein map karna:
        const formattedData = res.response?.data?.data.map((chat) => {
          // Participants array mein se opposite user find karein
          const opponent =
            chat.participants.find((user) => user._id !== UserLoginId) || {};

          // Date formatting for UI (e.g., Time or Date)
          const messageTime = chat.lastMessage?.createdAt
            ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
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
    }
  }, [UserLoginId]);

  // 2. Component Mount hone par API call
  useEffect(() => {
    FetchAllConversations();
  }, [FetchAllConversations]);

  // Selected chat state

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
        setMessages(response?.data?.data || []);
      }
    }

    if (chat.id && chat.unread > 0) {
      await mark_read_conversation_patch_API(chat.id);
    }
  };

  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsgObj]);
    setNewMessage("");
  };

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
                    <span className="text-xs text-slate-400">{chat.time}</span>
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
          <div className="hidden md:flex flex-1 flex-col bg-white">
            {/* Active Chat Header */}
            <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur">
              <ChatHeader user={activeChat} />

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-slate-600">
                <button className="p-2 hover:bg-slate-100 rounded-full transition">
                  <Phone size={18} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition">
                  <Video size={18} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <ChatMessageList
              messages={messages}
              UserLoginId={UserLoginId}
              size="lg"
            />

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
            >
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
              >
                <ImageIcon size={20} />
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 py-2 px-4 bg-slate-100 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
              />

              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
              >
                <Smile size={20} />
              </button>

              <button
                type="submit"
                className="p-2.5 bg-[#fbba00] hover:bg-blue-700 text-white rounded-full transition shadow-md shadow-blue-500/20 flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* Empty State if no chat selected */
          <div className="hidden md:flex flex-1 items-center justify-center text-slate-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAllMessaging;
