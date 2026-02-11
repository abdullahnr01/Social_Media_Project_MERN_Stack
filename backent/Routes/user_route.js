const express = require("express");
const router = express.Router();

const {
  UserGetDataController,
  UserPostController,
  UserDeletePostController,
  UserPatchLikeController,
  UserPostCommentController,
  getAllCommentsController,
  UserPostCommentReplyController,
  getAllCommentReplyController,
  // followUserController,
  getNotificationController,
  // respondFollowController,
} = require("../Controller/user_post_controller");

const {
  getUserInfoDataController,
  getUserPrflImgController,
  UserloginController,
  UserSignUpController,
  UpdateUserInfoController,
  UserProfileUpdateController,
  GetMyPostController,
  googleAuthController,
} = require("../Controller/user_profile_controller");

// Multer Middlewares

const PostMulter = require("../Multer/post_multer_middleware");
const ProfileImageMulter = require("../Multer/profile_multer_middleware");

//
const {
  user_login_middleware,
  auth_middleware,
  user_signUp_middleware,
} = require("../Middleware/user_middleware");

// Routers   ----------------------------

// Get ------------------------------GET---------
router.get("/getpostdata", auth_middleware, UserGetDataController);

router.get("/getuserinfo_data", auth_middleware, getUserInfoDataController);

router.get("/getuserprofileimage", auth_middleware, getUserPrflImgController);

router.get("/getAllcomments", auth_middleware, getAllCommentsController);

router.get(
  "/getAllCommentreplies",
  auth_middleware,
  getAllCommentReplyController,
);

router.get("/getAllMyPosts", auth_middleware, GetMyPostController);

router.get("/getAllNotification", auth_middleware, getNotificationController);


// Post ----------------------------POST--------

router.post(
  "/postdata",
  auth_middleware,
  PostMulter.single("image"),
  UserPostController,
);

router.post("/signup", user_signUp_middleware, UserSignUpController);
router.post("/login", user_login_middleware, UserloginController);

// router.post("/follow", auth_middleware, followUserController);

router.post("/comment", auth_middleware, UserPostCommentController);

router.post(
  "/comment_reply_post",
  auth_middleware,
  UserPostCommentReplyController,
);

router.post("/auth/google", googleAuthController);

// delete -----------------------------

router.delete("/deletepostdata", auth_middleware, UserDeletePostController);

// patch --------------------------------

router.patch(
  "/uploadprofile",
  auth_middleware,
  ProfileImageMulter.single("image"),
  UserProfileUpdateController,
);

router.patch(
  "/UpdateUserinfo_data",
  auth_middleware,
  ProfileImageMulter.single("image"),
  UpdateUserInfoController,
);

router.patch("/like", auth_middleware, UserPatchLikeController);

// router.patch("/res_follow", auth_middleware, respondFollowController);

module.exports = router;
