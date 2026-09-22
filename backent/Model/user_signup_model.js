const { Schema, model } = require("mongoose");

const userSignUpSchema = new Schema(
  {
    image: { type: String, default: null },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    user_bio: {
      type: String,
    },
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

userSignUpSchema.index({
  firstname: 1,
  lastname: 1,
});

const UserSignUp = model("UserSignUp", userSignUpSchema);

module.exports = UserSignUp;
