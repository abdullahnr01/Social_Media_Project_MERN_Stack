const express = require("express");
const router = express.Router();

const UserLiveChatController = require("../Controller/user_live_chat_controller");

const { auth_middleware } = require("../Middleware/user_middleware");

router.get(
  "/user_all_conversion/:targetUserId",
  auth_middleware,
  UserLiveChatController.user_get_OR_create_conversion,
);

router.get(
  "/user_all_messages",
  auth_middleware,
  UserLiveChatController.user_get_all_message,
);

router.post(
  "/userlivechat",
  auth_middleware,
  UserLiveChatController.user_live_chat_post,
);

module.exports = router;
