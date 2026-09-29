// unfollowController.js

const UserFollow = require("../Model/user_follow_model");



module.exports.followUserController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const targetUserId = req.body.userId;

    let existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
    });

    if (!existingFollow) {
      existingFollow = await UserFollow.findOne({
        loginUser: targetUserId,
        targetuser: loginUserId,
      });
    }

    let updatedFollow;

    // follow request send krne wala

    if (existingFollow) {
      // Update the existing record directly
      updatedFollow = await UserFollow.findByIdAndUpdate(
        existingFollow._id,
        { status: "Pending", isDeleted: false },
        { new: true },
      );
    } else {
      // Create a new follow request
      updatedFollow = await UserFollow.create({
        loginUser: loginUserId,
        targetuser: targetUserId,
        status: "Pending",
      });
    }

    const io = req.app.get("io");
    io.to(targetUserId.toString()).emit("followRequestReceived", {
      from: loginUserId,
      status: "Request",
    });

    // 2️⃣ Sender ko pending confirmation
    io.to(loginUserId.toString()).emit("followRequestSent", {
      to: targetUserId,
      status: "Pending...",
    });

    return res.status(200).json({
      message: "Follow request sent..",
      // value: "Pending...",
      // data: updatedFollow,
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
      {
        $or: [
          { targetuser: loginUserId, loginUser: targetId },
          { targetuser: targetId, loginUser: loginUserId },
        ],
        status: "Pending",
        isDeleted: false,
      },
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
    io.to(targetId.toString()).emit("followStatusUpdated", {
      userId: loginUserId,
      follow_Status: frontendStatus,
    });

    io.to(loginUserId.toString()).emit("followStatusUpdated", {
      userId: targetId,
      follow_Status: frontendStatus,
    });

    return res.status(200).json({
      message: `Request ${action} successfully`,
      // response: {
      //   ...updated.toObject(),
      //   followStatus: frontendStatus, // frontend-friendly
      // },
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
    let existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
      status: "Pending",
      isDeleted: false,
    });

    if (!existingFollow) {
      existingFollow = await UserFollow.findOne({
        loginUser: targetUserId,
        targetuser: loginUserId,
        status: "Pending",
        isDeleted: false,
      });
    }

    if (!existingFollow) {
      return res
        .status(404)
        .json({ success: false, message: "Pending follow request not found" });
    }

    // Soft delete
    existingFollow.isDeleted = true;
    existingFollow.status = "Withdraw";
    await existingFollow.save();

    const io = req.app.get("io");
    io.to(targetUserId.toString()).emit("WithdrawStatusUpdated", {
      userId: loginUserId, // login user ne withdraw kiya
      follow_Status: "Follow",
    });

    // Login user: button reset to "Follow"
    io.to(loginUserId.toString()).emit("WithdrawStatusUpdated", {
      userId: targetUserId, // target user pe bhi update
      follow_Status: "Follow",
    });

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

    let existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
      status: "accepted",
    });

    let isSwap = false;
    if (!existingFollow) {
      existingFollow = await UserFollow.findOne({
        loginUser: targetUserId,
        targetuser: loginUserId,
        status: "accepted",
      });
      if (existingFollow) isSwap = true;
    }

    if (!existingFollow) {
      return res
        .status(404)
        .json({ success: false, message: "Following record not found" });
    }

    // Soft delete
    if (!isSwap) {
      existingFollow.isDeleted = true;
      existingFollow.status = "UnFollow";
      await existingFollow.save();
    } else {
      existingFollow.isDeleted = true;
      existingFollow.status = "Removing";
      await existingFollow.save();
    }

    const io = req.app.get("io");
    io.to(loginUserId.toString()).emit("UnfollowStatusUpdated", {
      userId: targetUserId,
      follow_Status: "Follow", // Login user perspective
    });

    io.to(targetUserId.toString()).emit("UnfollowStatusUpdated", {
      userId: loginUserId,
      follow_Status: "Follow", // Target user perspective
    });
    return res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
    });
  } catch (err) {
    console.error("Unfollow Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
