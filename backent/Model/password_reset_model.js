const { Schema, model } = require("mongoose");

const passwordResetSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    codeHash: { type: String, default: null },
    codeExpiresAt: { type: Date, default: null },
    codeAttempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: null },
    resetTokenHash: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("PasswordReset", passwordResetSchema);
