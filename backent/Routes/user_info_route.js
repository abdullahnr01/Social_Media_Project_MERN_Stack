const express = require("express");
const router = express.Router();

const ProfileImageMulter = require("../Multer/profile_multer_middleware");

const UserProfile_Controller = require("../Controller/user_profile_controller");

const {
  user_login_middleware,
  auth_middleware,
  user_signUp_middleware,
} = require("../Middleware/user_middleware");

router.get(
  "/getuserinfo_data",
  auth_middleware,
  UserProfile_Controller.getUserInfoDataController,
);

router.get(
  "/getuserprofileimage",
  auth_middleware,
  UserProfile_Controller.getUserPrflImgController,
);

router.post(
  "/signup",
  user_signUp_middleware,
  UserProfile_Controller.UserSignUpController,
);
router.post(
  "/login",
  user_login_middleware,
  UserProfile_Controller.UserloginController,
);

router.post("/auth/google", UserProfile_Controller.googleAuthController);

router.patch(
  "/uploadprofile",
  auth_middleware,
  ProfileImageMulter.single("image"),
  UserProfile_Controller.UserProfileUpdateController,
);

router.patch(
  "/UpdateUserinfo_data",
  auth_middleware,
  ProfileImageMulter.single("image"),
  UserProfile_Controller.UpdateUserInfoController,
);

module.exports = router
