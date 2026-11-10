const UserSignUp = require("../Model/user_signup_model");
const UserFollow = require("../Model/user_follow_model");

module.exports.getSuggestedUsersController = async (req, res) => {
  try {
    const currentUserId = req.UserId.toString();
    const users = await UserSignUp.find({ _id: { $ne: req.UserId } })
      .select("firstname lastname image isPrivate")
      .sort({ createdAt: -1, _id: 1 })
      .lean();

    if (users.length === 0) {
      return res.status(200).json({ success: true, users: [] });
    }

    const userIds = users.map((user) => user._id);
    const followRecords = await UserFollow.find({
      $or: [
        { loginUser: req.UserId, targetuser: { $in: userIds } },
        { loginUser: { $in: userIds }, targetuser: req.UserId },
      ],
    })
      .select("loginUser targetuser status isDeleted")
      .lean();

    const connectedUserIds = new Set();
    for (const record of followRecords) {
      const isActiveConnection =
        record.status === "accepted" || (record.status === "Pending" && !record.isDeleted);
      if (!isActiveConnection) continue;

      const followerId = record.loginUser.toString();
      const targetId = record.targetuser.toString();
      if (followerId === currentUserId) connectedUserIds.add(targetId);
      if (targetId === currentUserId) connectedUserIds.add(followerId);
    }

    const suggestions = users
      .filter((user) => !connectedUserIds.has(user._id.toString()))
      .map((user) => ({ ...user, followStatus: "Follow" }));

    return res.status(200).json({
      success: true,
      users: suggestions,
    });
  } catch (error) {
    console.error("Suggested users error:", error);
    return res.status(500).json({ success: false, message: "Unable to load people to discover" });
  }
};

module.exports.UserSearchController = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("query" , query)

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const cleanQuery = query.trim();

    const sanitizedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(sanitizedQuery, "i");

    const users = await UserSignUp.find({
      $or: [
        { firstname: { $regex: searchRegex } },
        { lastname: { $regex: searchRegex } },
      ],
    })
      .select("firstname lastname image _id")
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      Users_Ids: users,
    });
  } catch (err) {
    console.error(`User Searching Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
