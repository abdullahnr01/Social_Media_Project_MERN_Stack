const { Schema, model } = require("mongoose");

const UserCommentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "UserPost",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserSignUp",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserComment = model("UserComment", UserCommentSchema);

module.exports = UserComment;
