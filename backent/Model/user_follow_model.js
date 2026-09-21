const { Schema, model } = require("mongoose");

const userFollowSchema = new Schema(
  {
    targetuser: {
      type: Schema.Types.ObjectId, // Target user (jisko follow kiya ja raha)
      ref: "UserSignUp",
      required: true,
    },
    loginUser: {
      type: Schema.Types.ObjectId, // Logged-in user (jo follow kar raha)
      ref: "UserSignUp",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "accepted",
        "rejected",
        "Withdraw",
        "UnFollow",
        "Removing",
      ],
      default: "Pending...",
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // automatically createdAt & updatedAt
  },
);

const UserFollow = model("userfollower", userFollowSchema);

module.exports = UserFollow;
