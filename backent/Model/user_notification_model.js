const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "UserSignUp",
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "UserSignUp",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "UserPost",
      required: true,
    },
    type: {
      type: String,
      enum: ["post_like"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = model("UserNotification", notificationSchema);
