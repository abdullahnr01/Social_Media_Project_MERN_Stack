const UserMessage = require("../Model/User_Live_Chat/user_messages_model");

const handleSendMessage = (io, socket) => {
  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, receiverId, text }) => {
      try {
        const newMessage = await UserMessage.create({
          conversationId,
          senderId,
          receiverId,
          text,
        });

        // 2️⃣ Sirf us room me broadcast karo
        io.to(conversationId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.log("Message Error:", error);
      }
    },
  );
};

module.exports = { handleSendMessage };
