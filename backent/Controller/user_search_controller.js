module.exports.UserSearchController = async (req , res) => {
  try {
  } catch (err) {
    console.error(`User Searching Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};
