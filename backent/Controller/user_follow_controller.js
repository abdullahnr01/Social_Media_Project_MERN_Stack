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

    const existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
    });

    let updatedFollow;

    if (existingFollow) {
      updatedFollow = await UserFollow.findOneAndUpdate(
        { loginUser: loginUserId, targetuser: targetUserId },
        { status: "Pending", isDeleted: false },
        { new: true },
      );
    } else {
      updatedFollow = await UserFollow.create({
        loginUser: loginUserId,
        targetuser: targetUserId,
        status: "Pending",
      });
    }
    return res.status(200).json({
      message: "Follow request sent..",
      value: "Pending...",
      data: updatedFollow,
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
      {
        status: action,
        isDeleted: true,
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    let frontendStatus;
    if (action === "accepted") {
      frontendStatus = "Following";
    } else if (action === "rejected") {
      frontendStatus = "Follow";
    } else {
      frontendStatus = updated.status; // fallback
    }

    const io = req.app.get("io");
    io.emit("followStatusUpdated", {
      targetId,
      loginUserId,
      follow_Status: frontendStatus,
    });

    return res.status(200).json({
      message: `Request ${action} successfully`,
      response: {
        ...updated.toObject(),
        followStatus: frontendStatus, // frontend-friendly
      },
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
      status: "Pending",
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
      value: "Follow",
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
      status: "accepted",
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

    const io = req.app.get("io");
    io.emit("UnfollowStatusUpdate", {
      targetUserId,
      loginUserId,
      follow_Status: "Follow",
    });

    return res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
      value: "Follow",
    });
  } catch (err) {
    console.error("Unfollow Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
