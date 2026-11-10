// unfollowController.js

const mongoose = require("mongoose");
const UserFollow = require("../Model/user_follow_model");
const UserSignUp = require("../Model/user_signup_model");

module.exports.followUserController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const targetUserId = req.body.userId;
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const target = await UserSignUp.findById(targetUserId).select("isPrivate");
    if (!target) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (loginUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    const existingFollow = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetUserId,
    });
    if (existingFollow?.status === "accepted") {
      return res.status(200).json({ success: true, followStatus: "Following", message: "You are already following this user" });
    }
    if (existingFollow?.status === "Pending" && !existingFollow.isDeleted) {
      return res.status(200).json({ success: true, followStatus: "Pending...", message: "Follow request already sent" });
    }

    const nextStatus = target.isPrivate ? "Pending" : "accepted";
    if (existingFollow) {
      existingFollow.status = nextStatus;
      existingFollow.isDeleted = false;
      await existingFollow.save();
    } else {
      await UserFollow.create({
        loginUser: loginUserId,
        targetuser: targetUserId,
        status: nextStatus,
        isDeleted: false,
      });
    }

    const followStatus = nextStatus === "Pending" ? "Pending..." : "Following";
    const io = req.app.get("io");
    if (nextStatus === "Pending") {
      io.to(targetUserId.toString()).emit("followRequestReceived", {
        from: loginUserId,
        status: "Request",
      });
      io.to(loginUserId.toString()).emit("followRequestSent", {
        to: targetUserId,
        status: "Pending...",
      });
    } else {
      io.to(loginUserId.toString()).emit("followStatusUpdated", {
        userId: targetUserId,
        follow_Status: "Following",
      });
      io.to(targetUserId.toString()).emit("followStatusUpdated", {
        userId: loginUserId,
        follow_Status: "Follow",
      });
    }

    return res.status(200).json({
      success: true,
      followStatus,
      message: nextStatus === "Pending" ? "Follow request sent" : "You are now following this user",
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
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid follow request action" });
    }
    const updated = await UserFollow.findOneAndUpdate(
      {
        targetuser: loginUserId,
        loginUser: targetId,
        status: "Pending",
        isDeleted: false,
      },
      {
        status: action,
        isDeleted: action !== "accepted",
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    const io = req.app.get("io");
    io.to(targetId.toString()).emit("followStatusUpdated", {
      userId: loginUserId,
      follow_Status: action === "accepted" ? "Following" : "Follow",
    });

    const currentUserRelation = await UserFollow.findOne({
      loginUser: loginUserId,
      targetuser: targetId,
      status: "accepted",
    }).select("_id");
    io.to(loginUserId.toString()).emit("followStatusUpdated", {
      userId: targetId,
      follow_Status: currentUserRelation ? "Following" : "Follow",
    });

    return res.status(200).json({
      message: `Request ${action} successfully`,
      followStatus: action === "accepted" ? "Following" : "Follow",
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

    // if (!existingFollow) {
    //   existingFollow = await UserFollow.findOne({
    //     loginUser: targetUserId,
    //     targetuser: loginUserId,
    //     status: "Pending",
    //     isDeleted: false,
    //   });
    // }

    if (!existingFollow) {
      return res.status(404).json({
        success: false,
        message:
          "Pending follow request not found or you are not authorized to withdraw.",
      });
    }

    await UserFollow.findByIdAndDelete(existingFollow._id);

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

    existingFollow.isDeleted = true;
    existingFollow.status = "UnFollow";
    await existingFollow.save();

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

// Followers & Following List Controller
module.exports.getFollowersAndFollowingController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    //  Followers: Jo log is user ko follow kar rahe hain (targetuser = userId)
    const followers = await UserFollow.find({
      targetuser: userId,
      status: "accepted",
    })
      .populate("loginUser", "firstname lastname image")
      .sort({ updatedAt: -1 });

    //  Following: Jin logon ko is user ne follow kiya hai (loginUser = userId)
    const following = await UserFollow.find({
      loginUser: userId,
      status: "accepted",
    })
      .populate("targetuser", "firstname lastname image")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      followers: followers.map((f) => f.loginUser).filter(Boolean),
      following: following.map((f) => f.targetuser).filter(Boolean),
    });
  } catch (err) {
    console.error("Get Connections Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
