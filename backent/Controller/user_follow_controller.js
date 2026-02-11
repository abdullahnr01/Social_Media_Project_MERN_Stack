// unfollowController.js

const UserFollow = require("../Model/user_follow_model");

module.exports.getFollowStatusController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const followStatus = await UserFollow.find(
      { targetuser: loginUserId },
      "status",
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      data: followStatus,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports.followUserController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const targetUserId = req.body.userId;

    const newFollow = await UserFollow.create({
      loginUser: loginUserId,
      targetuser: targetUserId,
      status: "Pending...",
    });

    return res.status(200).json({
      message: "Follow request sent..",
      follow: newFollow,
    });
  } catch (err) {
    console.error(`User following Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports.respondFollowController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const { targetId, action } = req.body;
    const updated = await UserFollow.findOneAndUpdate(
      { targetuser: loginUserId, loginUser: targetId },
      { status: action },
      { new: true },
    );

    console.log(updated.status);
    const io = req.app.get("io");
    io.emit("followStatusUpdated", {
      targetId,
      loginUserId,
      follow_Status: updated.status,
    });

    return res.status(200).json({
      message: `Request ${action} successfully`,
      response: updated,
    });
  } catch (err) {
    console.error(`Respond User following Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports.withdrawFollowController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const targetUserId = req.body.userId;

    // Find the pending follow request
    const existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
      status: "Pending...",
      isDeleted: false, // soft delete
    });

    if (!existingFollow) {
      return res
        .status(404)
        .json({ success: false, message: "Pending follow request not found" });
    }

    // Soft delete
    existingFollow.isDeleted = true;
    existingFollow.status = "Withdraw";
    await existingFollow.save();

    return res.status(200).json({
      success: true,
      message: "Follow request withdrawn successfully",
    });
  } catch (err) {
    console.error("Withdraw Follow Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports.unfollowController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const targetUserId = req.body.userId;

    // Find the following relationship
    const existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
      status: "Following",
      isDeleted: false, // soft delete
    });

    if (!existingFollow) {
      return res
        .status(404)
        .json({ success: false, message: "Following record not found" });
    }

    // Soft delete
    existingFollow.isDeleted = true;
    existingFollow.status = "UnFollow";
    await existingFollow.save();

    return res
      .status(200)
      .json({ success: true, message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
