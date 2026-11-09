const UserSignUp = require("../Model/user_signup_model");
const UserFollow = require("../Model/user_follow_model");

const canViewUserPosts = async (viewerId, ownerId) => {
  if (!viewerId || !ownerId) return false;
  if (viewerId.toString() === ownerId.toString()) return true;

  const owner = await UserSignUp.findById(ownerId).select("isPrivate").lean();
  if (!owner) return false;
  if (!owner.isPrivate) return true;

  return Boolean(
    await UserFollow.exists({
      loginUser: viewerId,
      targetuser: ownerId,
      status: "accepted",
    }),
  );
};

module.exports = { canViewUserPosts };
