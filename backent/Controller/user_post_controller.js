// User Info Model
const UserSignUp = require("../Model/user_signup_model");
// User Post Model
const User = require("../Model/user_model");
// User Comment Model
const UserComment = require("../Model/user_comment_model");
// User Comment Reply Model
const UserCommentReply = require("../Model/user_comment_reply");
//
const UserFollow = require("../Model/user_follow_model");

//

const cloudinary = require("../Cloudinary/CloudinaryConfig");
const fs = require("fs");

// Get -------------------------------------------
const UserGetDataController = async (req, res) => {
  try {
    const User_Id = req.UserId;

    const GetData = await User.find()
      .populate("user_id", "firstname lastname image")

      .sort({ createdAt: -1 });

    const AllPostsWithLikes = GetData.map((post) => ({
      ...post.toObject(),
      likeCount: post.likes.length || 0,
      isLiked: post.likes.includes(User_Id) || false,
    }));

    res.status(200).json(AllPostsWithLikes);
  } catch (err) {
    console.error(`Get data Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const getAllCommentsController = async (req, res) => {
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

const getAllCommentReplyController = async (req, res) => {
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

const getNotificationController = async (req, res) => {
  try {
    const loginUserId = req.UserId;

    const notification = await UserFollow.find({
      targetuser: loginUserId,
      status: "Pending...",
    })
      .populate("loginUser", "firstname lastname image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: notification,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const getFollowStatusController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const followStatus = await UserFollow.find(
      { targetuser: loginUserId },
      "status"
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      data: followStatus,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

// Post ---------------------------------------

const UserPostController = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;

    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "UserPosts", // Cloudinary folder
      resource_type: "auto", // image ya video dono allow
    });

    fs.unlinkSync(filePath);

    const newPost = await User.create({
      title,
      description,
      image: result.secure_url,
      hashtags,
      user_id: req.UserId,
    });

    return res.status(200).json({ message: "Post created successfully!" });
    // res.status(201).json({ message: "Post created!", post: newPost});
  } catch (err) {
    console.error(`User Posts Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const UserPostCommentController = async (req, res) => {
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
      newComment._id
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

const UserPostCommentReplyController = async (req, res) => {
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
      "firstname lastname image"
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

const followUserController = async (req, res) => {
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

const respondFollowController = async (req, res) => {
  try {
    const loginUserId = req.UserId;
    const { targetId, action } = req.body;
    const updated = await UserFollow.findOneAndUpdate(
      { targetuser: loginUserId, loginUser: targetId },
      { status: action },
      { new: true }
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

// Delete ------------------------------------

const UserDeletePostController = async (req, res) => {
  try {
    const { userId } = req.query;
    const delete_user = await User.findByIdAndDelete(userId);
    if (!delete_user) {
      return res.status(404).json({ error: "Id is invalid" });
    }
    return res.status(200).json({ message: "User Successfully Delete" });
  } catch (err) {
    console.error(`Delete data Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

// Update ---------------------

const UserPatchLikeController = async (req, res) => {
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

module.exports = {
  UserPostController,
  UserGetDataController,
  UserDeletePostController,
  UserPatchLikeController,
  UserPostCommentController,
  getAllCommentsController,
  UserPostCommentReplyController,
  getAllCommentReplyController,
  followUserController,
  getNotificationController,
  respondFollowController,
  getFollowStatusController,
};

// const UploadImageController = async (req, res) => {
//   try {

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "UserUploads",
//     });

//     // Delete local file after upload
//     fs.unlinkSync(req.file.path);

//     // Response
//     res.status(200).json({
//       success: true,
//       message: "Image uploaded successfully!",
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
