const mongoose = require("mongoose");
const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSignUp" }],
    lastMessage: {
      text: String,
    },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Indexing for faster searching
ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model("UserConversation", ConversationSchema);

//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdAt: { type: Date, default: Date.now },
