const { Schema, model } = require("mongoose");

const userSignUpSchema = new Schema(
  {
    image: { type: String, default: null },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserSignUp = model("UserSignUp", userSignUpSchema);

module.exports = UserSignUp;
