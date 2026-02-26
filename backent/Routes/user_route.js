const express = require("express");
const router = express.Router();

const UserPostsLike = require("../Controller/user_like_controller");
const UserNotification = require("../Controller/user_notification_controller");

//
const { auth_middleware } = require("../Middleware/user_middleware");

// Get --------------------------------------

router.get(
  "/getAllNotification",
  auth_middleware,
  UserNotification.getNotificationController,
);

// Post ----------------------------------

// Delete -----------------------------

// Patch --------------------------------

router.patch("/like", auth_middleware, UserPostsLike.UserPatchLikeController);

module.exports = router;
