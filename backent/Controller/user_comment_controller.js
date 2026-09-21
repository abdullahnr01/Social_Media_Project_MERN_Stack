const UserSignUp = require("../Model/user_signup_model");
const User = require("../Model/user_post_model");
const UserComment = require("../Model/user_comment_model");
// User Comment Reply Model
const UserCommentReply = require("../Model/user_comment_reply");

module.exports.getAllCommentsController = async (req, res) => {
  try {
    const User_Id = req.UserId;
    const postId = req.headers["post-id"];

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const GetAllComments = await UserComment.find({ postId: postId })
      .populate("userId", "firstname lastname image")
      .sort({ createdAt: -1 });

    return res.status(200).json(GetAllComments);
  } catch (err) {
    console.error(`Get All comments Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports.getAllCommentReplyController = async (req, res) => {
  try {
    const User_Id = req.UserId;
    const CommentId = req.headers["comment-id"];
    if (!CommentId) {
      return res.status(400).json({ message: "Comment ID is required" });
    }
    const GetAllCommentsReply = await UserCommentReply.find({
      commentId: CommentId,
    })
      .populate("userId", "firstname lastname image")
      .sort({ createdAt: -1 });

    return res.status(200).json(GetAllCommentsReply);
  } catch (err) {
    console.error(`Get All comments Reply Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports.UserPostCommentController = async (req, res) => {
  try {
    const { comment, PostId } = req.body;
    const User_Id = req.UserId;

    //
    const UserExisting = await UserSignUp.findById(User_Id);
    if (!UserExisting) {
      return res.status(400).json({ message: "Invalid User" });
    }

    const PostExisting = await User.findById(PostId);
    if (!PostExisting) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = await UserComment.create({
      postId: PostExisting,
      userId: UserExisting,
      comment: comment,
    });

    const populatedComment = await UserComment.findById(
      newComment._id,
    ).populate("userId", "firstname lastname image");

    const io = req.app.get("io");

    io.emit("newCommentAdded", {
      PostId,
      comment: populatedComment,
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (err) {
    console.error(`User Comment Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports.UserPostCommentReplyController = async (req, res) => {
  try {
    const User_Id = req.UserId;
    const { commentId, reply } = req.body;

    if (!commentId || !reply) {
      return res
        .status(400)
        .json({ message: "Comment ID and Reply are required" });
    }

    const newReply = new UserCommentReply({
      userId: User_Id,
      commentId: commentId,
      commentReply: reply,
    });

    const savedReply = await newReply.save();

    const populatedReply = await savedReply.populate(
      "userId",
      "firstname lastname image",
    );

    const io = req.app.get("io");
    io.emit("commentReplyAdded", {
      commentId,
      data: populatedReply,
    });

    return res.status(200).json({
      success: true,
      message: "Comment reply successfully",
      data: populatedReply,
    });
  } catch (err) {
    console.error(`User Post Comment Reple error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
