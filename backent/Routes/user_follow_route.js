const express = require("express");
const router = express.Router();

const UserFollow = require("../Controller/user_follow_controller");

const { auth_middleware } = require("../Middleware/user_middleware");

// router.get(
//   "/getAllFollowStatus",
//   auth_middleware,
//   UserFollow.getFollowStatusController,
// );

router.post("/follow", auth_middleware, UserFollow.followUserController);
router.patch("/withdraw", auth_middleware, UserFollow.withdrawFollowController);

router.patch("/unfollow", auth_middleware, UserFollow.unfollowController);

router.patch(
  "/res_follow",
  auth_middleware,
  UserFollow.respondFollowController,
);

module.exports = router;
