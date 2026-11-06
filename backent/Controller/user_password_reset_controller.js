const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../Model/user_signup_model");
const PasswordReset = require("../Model/password_reset_model");

const GENERIC_MESSAGE =
  "If an account exists for that email, a verification code has been sent.";

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const getCodeSecret = () =>
  process.env.RESET_CODE_SECRET || process.env.LOGIN_SECRET_KEY;

const hashCode = (email, code) =>
  crypto
    .createHmac("sha256", getCodeSecret())
    .update(`${email}:${code}`)
    .digest("hex");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createMailer = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

module.exports.sendPasswordResetCode = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const mailer = createMailer();
  const secret = getCodeSecret();
  if (!mailer || !secret) {
    return res.status(503).json({
      message: "Password reset email is not configured yet. Please try again later.",
    });
  }

  try {
    const user = await User.findOne({ email }).select("email");
    if (!user) return res.status(200).json({ message: GENERIC_MESSAGE });

    const now = new Date();
    const existing = await PasswordReset.findOne({ email });
    if (
      existing?.lastSentAt &&
      now.getTime() - existing.lastSentAt.getTime() < 60_000
    ) {
      return res.status(200).json({ message: GENERIC_MESSAGE });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    await PasswordReset.findOneAndUpdate(
      { email },
      {
        $set: {
          codeHash: hashCode(email, code),
          codeExpiresAt: new Date(now.getTime() + 10 * 60_000),
          codeAttempts: 0,
          lastSentAt: now,
          resetTokenHash: null,
          verifiedAt: null,
          expiresAt: new Date(now.getTime() + 15 * 60_000),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    try {
      await mailer.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: "Your SocialFirst password reset code",
        text: `Your SocialFirst verification code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#202124"><h2 style="color:#c28c00">Reset your SocialFirst password</h2><p>Use this verification code to continue:</p><div style="font-size:32px;font-weight:700;letter-spacing:10px;padding:16px 0">${code}</div><p>This code expires in 10 minutes. If you did not request a password reset, you can ignore this email.</p></div>`,
      });
    } catch (mailError) {
      await PasswordReset.deleteOne({ email });
      throw mailError;
    }

    return res.status(200).json({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Password reset code email error:", error);
    return res.status(500).json({ message: "Unable to send the code right now." });
  }
};

module.exports.verifyPasswordResetCode = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";

  if (!/^\S+@\S+\.\S+$/.test(email) || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ message: "Enter your email and 6-digit code." });
  }

  if (!getCodeSecret()) {
    return res.status(503).json({ message: "Password reset is not available right now." });
  }

  try {
    const reset = await PasswordReset.findOne({ email });
    if (
      !reset ||
      !reset.codeHash ||
      !reset.codeExpiresAt ||
      reset.codeExpiresAt <= new Date() ||
      reset.codeAttempts >= 5
    ) {
      return res.status(400).json({ message: "That code is invalid or expired. Request a new code." });
    }

    reset.codeAttempts += 1;
    const submittedHash = Buffer.from(hashCode(email, code), "hex");
    const savedHash = Buffer.from(reset.codeHash, "hex");
    const isValid =
      submittedHash.length === savedHash.length &&
      crypto.timingSafeEqual(submittedHash, savedHash);

    if (!isValid) {
      if (reset.codeAttempts >= 5) reset.codeHash = null;
      await reset.save();
      return res.status(400).json({ message: "That code is invalid or expired. Request a new code." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    reset.codeHash = null;
    reset.codeExpiresAt = null;
    reset.resetTokenHash = hashToken(resetToken);
    reset.verifiedAt = new Date();
    reset.expiresAt = new Date(Date.now() + 10 * 60_000);
    await reset.save();

    return res.status(200).json({
      message: "Email verified. You can now set a new password.",
      resetToken,
    });
  } catch (error) {
    console.error("Password reset code verification error:", error);
    return res.status(500).json({ message: "Unable to verify the code right now." });
  }
};

module.exports.resetPassword = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const resetToken = typeof req.body?.resetToken === "string" ? req.body.resetToken : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!/^\S+@\S+\.\S+$/.test(email) || !resetToken || password.length < 8) {
    return res.status(400).json({ message: "Enter a valid new password of at least 8 characters." });
  }

  try {
    const reset = await PasswordReset.findOneAndDelete({
      email,
      resetTokenHash: hashToken(resetToken),
      verifiedAt: { $ne: null },
      expiresAt: { $gt: new Date() },
    });
    if (!reset) {
      return res.status(400).json({ message: "Your password reset session expired. Start again." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: passwordHash, authProvider: "local" } },
      { new: true },
    );

    if (!user) return res.status(400).json({ message: "Your password reset session expired. Start again." });
    return res.status(200).json({ message: "Your password has been reset. You can now log in." });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Unable to reset your password right now." });
  }
};
