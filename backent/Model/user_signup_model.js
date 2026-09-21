const { Schema, model } = require("mongoose");

const userSignUpSchema = new Schema(
  {
    image: { type: String, default: null },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    date_of_birth: { type: Date, required: false },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    googleId: { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true },
);

const UserSignUp = model("UserSignUp", userSignUpSchema);

module.exports = UserSignUp;
