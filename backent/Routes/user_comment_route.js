const express = require("express");
const router = express.Router();

const UserPostComment_Controller = require("../Controller/user_comment_controller");

const { auth_middleware } = require("../Middleware/user_middleware");

router.get(
  "/getAllcomments",
  auth_middleware,
  UserPostComment_Controller.getAllCommentsController,
);

router.get(
  "/getAllCommentreplies",
  auth_middleware,
  UserPostComment_Controller.getAllCommentReplyController,
);

router.post(
  "/comment",
  auth_middleware,
  UserPostComment_Controller.UserPostCommentController,
);

router.post(
  "/comment_reply_post",
  auth_middleware,
  UserPostComment_Controller.UserPostCommentReplyController,
);

module.exports = router;
