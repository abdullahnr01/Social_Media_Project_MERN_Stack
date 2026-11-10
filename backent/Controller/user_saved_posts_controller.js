const mongoose = require("mongoose");
const UserInfo = require("../Model/user_signup_model");
const UserPost = require("../Model/user_post_model");
const UserFollow = require("../Model/user_follow_model");
const { canViewUserPosts } = require("../Middleware/private_account_access");

module.exports.savePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID" });
    }

    const post = await UserPost.findById(postId).select("_id user_id");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (!(await canViewUserPosts(req.UserId, post.user_id))) {
      return res.status(403).json({ success: false, message: "This account is private" });
    }

    await UserInfo.updateOne(
      { _id: req.UserId },
      { $addToSet: { savedPosts: post._id } },
    );

    return res.status(200).json({ success: true, isSaved: true, message: "Post saved" });
  } catch (error) {
    console.error("Save post error:", error);
    return res.status(500).json({ success: false, message: "Unable to save this post" });
  }
};

module.exports.unsavePostController = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID" });
    }

    await UserInfo.updateOne(
      { _id: req.UserId },
      { $pull: { savedPosts: new mongoose.Types.ObjectId(postId) } },
    );

    return res.status(200).json({ success: true, isSaved: false, message: "Post removed from Saved" });
  } catch (error) {
    console.error("Unsave post error:", error);
    return res.status(500).json({ success: false, message: "Unable to remove this post" });
  }
};

module.exports.getSavedPostsController = async (req, res) => {
  try {
    const currentUser = await UserInfo.findById(req.UserId).select("savedPosts").lean();
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const savedIds = currentUser.savedPosts || [];
    const posts = await UserPost.find({ _id: { $in: savedIds } })
      .sort({ createdAt: -1 })
      .lean();

    if (posts.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const ownerIds = [...new Map(posts.map((post) => [post.user_id.toString(), post.user_id])).values()];
    const [owners, followRecords] = await Promise.all([
      UserInfo.find({ _id: { $in: ownerIds } })
        .select("firstname lastname image isPrivate")
        .lean(),
      UserFollow.find({
        $or: [
          { loginUser: req.UserId, targetuser: { $in: ownerIds } },
          { loginUser: { $in: ownerIds }, targetuser: req.UserId },
        ],
      })
        .select("loginUser targetuser status isDeleted")
        .lean(),
    ]);

    const ownerById = new Map(owners.map((owner) => [owner._id.toString(), owner]));
    const visiblePosts = [];

    for (const post of posts) {
      const ownerId = post.user_id.toString();
      const owner = ownerById.get(ownerId);
      if (!owner || !(await canViewUserPosts(req.UserId, owner._id))) continue;

      const outgoing = followRecords.find((record) =>
        record.loginUser.toString() === req.UserId && record.targetuser.toString() === ownerId,
      );
      const incoming = followRecords.find((record) =>
        record.loginUser.toString() === ownerId && record.targetuser.toString() === req.UserId,
      );
      let followStatus = "Follow";
      if (outgoing?.status === "accepted") {
        followStatus = "Following";
      } else if (outgoing?.status === "Pending" && !outgoing.isDeleted) {
        followStatus = "Pending...";
      } else if (incoming?.status === "Pending" && !incoming.isDeleted) {
        followStatus = "Request";
      }

      visiblePosts.push({
        ...post,
        user_id: ownerId,
        userInfo: owner,
        likeCount: post.likes?.length || 0,
        isLiked: post.likes?.some((id) => id.toString() === req.UserId) || false,
        isSaved: true,
        followStatus,
      });
    }

    return res.status(200).json({ success: true, data: visiblePosts });
  } catch (error) {
    console.error("Get saved posts error:", error);
    return res.status(500).json({ success: false, message: "Unable to load saved posts" });
  }
};
