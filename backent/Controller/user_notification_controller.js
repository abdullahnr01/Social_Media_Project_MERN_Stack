const mongoose = require("mongoose");


const UserFollow = require("../Model/user_follow_model");

module.exports.getNotificationController = async (req, res) => {
  try {
    const loginUserId = req.UserId;

    const notification = await UserFollow.find({
      targetuser: loginUserId,
      status: "Pending",
    })
      .populate("loginUser", "firstname lastname image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: notification,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};