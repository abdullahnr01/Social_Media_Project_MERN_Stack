const mongoose = require("mongoose");

const UserMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserConversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSignUp",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSignUp",
      default: null,
      //   required: true,
    },
    text: { type: String, trim: true, require: true },
  },
  { timestamps: true },
);

UserMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("UserAllMessage", UserMessageSchema);

//   messageType: {
//     type: String,
//     enum: ['text', 'image', 'file', 'video'],
//     default: 'text'
//   },
//   fileUrl: { type: String }, // Agar image ya file ho
//   status: {
//     type: String,
//     enum: ['sent', 'delivered', 'seen'],
//     default: 'sent'
//   }
