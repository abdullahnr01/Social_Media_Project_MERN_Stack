const mongoose = require("mongoose");


const UserFollow = require("../Model/user_follow_model");
const UserNotification = require("../Model/user_notification_model");

module.exports.getNotificationController = async (req, res) => {
  try {
    const loginUserId = req.UserId;

    const [followRequests, postLikes] = await Promise.all([
      UserFollow.find({
        targetuser: loginUserId,
        status: "Pending",
      })
        .populate("loginUser", "firstname lastname image")
        .sort({ createdAt: -1 }),
      UserNotification.find({ recipient: loginUserId, type: "post_like" })
        .populate("actor", "firstname lastname image")
        .populate("post", "title image")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    res.status(200).json({
      data: followRequests,
      likes: postLikes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
