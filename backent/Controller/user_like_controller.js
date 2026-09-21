const mongoose = require("mongoose");
const User = require("../Model/user_post_model");

module.exports.UserPatchLikeController = async (req, res) => {
  try {
    const { postId } = req.query;
    const User_Id = req.UserId;

    const post = await User.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(User_Id);

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

    res.status(200).json({ likeCount, isLiked });
  } catch (err) {
    console.error(`Post Like Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
