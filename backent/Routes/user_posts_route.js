const express = require("express");
const router = express.Router();

const UserPost_Controller = require("../Controller/user_post_controller");

const { auth_middleware } = require("../Middleware/user_middleware");

const PostMulter = require("../Multer/post_multer_middleware");

// router.get("/getAllMyPosts", auth_middleware, GetMyPostController);

router.get("/getpostdata", auth_middleware, UserPost_Controller.UsersAllPosts);

router.get(
  "/getsinglepost_data/:id",
  auth_middleware,
  UserPost_Controller.getSinglePostController,
);

router.get("/userprofilewithposts/:id" , auth_middleware , UserPost_Controller.UserProfileWithPosts)

router.post(
  "/postdata",
  auth_middleware,
  PostMulter.array("image"),
  UserPost_Controller.UserPostController,
);

router.delete(
  "/deletepostdata",
  auth_middleware,
  UserPost_Controller.UserDeletePostController,
);

router.patch(
  "/:postId/edit_post",
  auth_middleware,
  PostMulter.array("image"),
  UserPost_Controller.UserEditPostController,
);

module.exports = router;
