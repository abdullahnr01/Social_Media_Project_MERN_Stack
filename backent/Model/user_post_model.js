const { Schema, model } = require("mongoose");

const userPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    hashtags: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "UserSignUp",
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "UserSignUp" }],
  },

  { timestamps: true }
);

const User = model("UserPost", userPostSchema);

module.exports = User;
