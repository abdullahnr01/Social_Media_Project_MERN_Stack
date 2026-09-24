const mongoose = require("mongoose");
const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSignUp" }],
    lastMessage: {
      text: { type: String, default: "" },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "UserSignUp" },
      createdAt: { type: Date, default: Date.now },
    },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model("UserConversation", ConversationSchema);

//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdAt: { type: Date, default: Date.now },
