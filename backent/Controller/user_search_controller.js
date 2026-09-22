const UserSignUp = require("../Model/user_signup_model");

module.exports.UserSearchController = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("query" , query)

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const cleanQuery = query.trim();

    const sanitizedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(sanitizedQuery, "i");

    const users = await UserSignUp.find({
      $or: [
        { firstname: { $regex: searchRegex } },
        { lastname: { $regex: searchRegex } },
      ],
    })
      .select("firstname lastname image _id")
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      Users_Ids: users,
    });
  } catch (err) {
    console.error(`User Searching Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
