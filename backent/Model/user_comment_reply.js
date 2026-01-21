const { Schema, model } = require("mongoose");

const replySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserSignUp",
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "UserComment",
      required: true,
    },
    commentReply: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CommentReply =  model("UserCommentReply", replySchema);

module.exports = CommentReply

