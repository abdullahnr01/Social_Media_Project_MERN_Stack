const express = require("express");
const router = express.Router();

const { auth_middleware } = require("../Middleware/user_middleware");

const UserSearch_Controller = require("../Controller/user_search_controller");

router.get(
  "/search",
  auth_middleware,
  UserSearch_Controller.UserSearchController,
);


module.exports = router;