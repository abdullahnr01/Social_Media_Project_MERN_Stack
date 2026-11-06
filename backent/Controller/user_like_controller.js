const mongoose = require("mongoose");
const User = require("../Model/user_post_model");
const UserNotification = require("../Model/user_notification_model");

module.exports.UserPatchLikeController = async (req, res) => {
  try {
    const { postId } = req.query;
    const User_Id = req.UserId;

    const post = await User.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.some(
      (likedUserId) => likedUserId.toString() === User_Id.toString(),
    );

    if (alreadyLiked) {
      post.likes.pull(User_Id);
    } else {
      post.likes.push(User_Id);
    }

    await post.save();

    const likeCount = post.likes.length;
    const isLiked = post.likes.includes(User_Id);

    const io = req.app.get("io");
    io.emit("likeUpdated", {
      postId,
      likeCount,
    });

    if (!alreadyLiked && post.user_id.toString() !== User_Id.toString()) {
      try {
        const notification = await UserNotification.create({
          recipient: post.user_id,
          actor: User_Id,
          post: post._id,
          type: "post_like",
        });
        const populatedNotification = await UserNotification.findById(notification._id)
          .populate("actor", "firstname lastname image")
          .populate("post", "title image")
          .lean();

        io.to(post.user_id.toString()).emit(
          "newPostLikeNotification",
          populatedNotification,
        );
      } catch (notificationError) {
        console.error("Post like notification error:", notificationError);
      }
    }

    res.status(200).json({ likeCount, isLiked });
  } catch (err) {
    console.error(`Post Like Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
