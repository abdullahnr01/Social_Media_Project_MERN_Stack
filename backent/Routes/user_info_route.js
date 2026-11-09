const express = require("express");
const router = express.Router();

const ProfileImageMulter = require("../Multer/profile_multer_middleware");

const UserProfile_Controller = require("../Controller/user_profile_controller");
const PasswordReset_Controller = require("../Controller/user_password_reset_controller");

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

router.patch(
  "/UpdateUserinfo_data",
  auth_middleware,
  ProfileImageMulter.single("image"),
  UserProfile_Controller.UpdateUserInfoController,
);

router.patch(
  "/privacy",
  auth_middleware,
  UserProfile_Controller.UpdatePrivacySettingsController,
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

router.post("/password-reset/request-code", PasswordReset_Controller.sendPasswordResetCode);
router.post("/password-reset/verify-code", PasswordReset_Controller.verifyPasswordResetCode);
router.post("/password-reset/reset", PasswordReset_Controller.resetPassword);

module.exports = router;

// router.patch(
//   "/uploadprofile",
//   auth_middleware,
//   ProfileImageMulter.single("image"),
//   UserProfile_Controller.UserProfileUpdateController,
// );

// router.get(
//   "/getuserprofileimage",
//   auth_middleware,
//   UserProfile_Controller.getUserPrflImgController,
// );
