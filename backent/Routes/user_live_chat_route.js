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
  "/user_get_all_conversion",
  auth_middleware,
  UserLiveChatController.get_user_all_conversations,
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

// Express Route
router.patch(
  "/mark_as_read/:conversationId",
  auth_middleware,
  UserLiveChatController.mark_as_read,
);

module.exports = router;
