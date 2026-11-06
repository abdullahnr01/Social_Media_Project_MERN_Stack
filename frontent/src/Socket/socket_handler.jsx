import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../Context/context";
import socket from "../Socket/socket_io";
import { user_get_all_conversion_API } from "../API layer/user_live_chat_api";
import { toast } from "react-toastify";

function SocketHandler() {
  const {
    UserInfo,
    activeConversationId,
    setUnreadMessagesCount,
  } = useContext(UserContext);
  const activeConversationIdRef = useRef(activeConversationId);
  activeConversationIdRef.current = activeConversationId;

  useEffect(() => {
    if (UserInfo && UserInfo._id) {
      socket.emit("joinUserRoom", UserInfo._id);

      const handleIncomingMessage = (incomingMessage) => {
        const conversationId = incomingMessage.conversationId?.toString();
        if (conversationId && conversationId === activeConversationIdRef.current?.toString()) {
          return;
        }
        setUnreadMessagesCount((count) => count + 1);
      };

      socket.on("receiveMessage", handleIncomingMessage);

      const handlePostLikeNotification = (notification) => {
        const actorName = [
          notification?.actor?.firstname,
          notification?.actor?.lastname,
        ]
          .filter(Boolean)
          .join(" ");
        toast.info(`${actorName || "Someone"} liked your post.`);
      };
      socket.on("newPostLikeNotification", handlePostLikeNotification);

      user_get_all_conversion_API().then((result) => {
        if (result?.success) {
          const conversations = result.response?.data?.data || [];
          const unreadTotal = conversations.reduce(
            (total, conversation) => total + (Number(conversation.unreadCount) || 0),
            0,
          );
          setUnreadMessagesCount(unreadTotal);
        }
      });

      return () => {
        socket.off("receiveMessage", handleIncomingMessage);
        socket.off("newPostLikeNotification", handlePostLikeNotification);
      };
    }
  }, [UserInfo?._id, setUnreadMessagesCount]);

  return null; // koi UI nahi
}

export default SocketHandler;
