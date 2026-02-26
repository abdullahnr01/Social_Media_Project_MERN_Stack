const mongoose = require("mongoose");

// User Post Model
const User = require("../Model/user_post_model");
const UserInfo = require("../Model/user_signup_model");
const cloudinary = require("../Cloudinary/CloudinaryConfig");
const streamifier = require("streamifier");
// Get -------------------------------------------

module.exports.getSinglePostController = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await User.findById(id); // MongoDB me post find karna
    if (!post) {
      return res.status(404).json({ message: "Post Id not found" });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again",
    });
  }
};

module.exports.GetMyPostController = async (req, res) => {
  try {
    const User_Id = req.UserId;

    const MyPosts = await User.find({ user_id: User_Id });

    return res.status(200).json({
      success: true,
      message: "My posts fetched successfully",
      response: MyPosts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching my posts",
    });
  }
};

module.exports.UsersAllPosts = async (req, res) => {
  try {
    const User_Id = new mongoose.Types.ObjectId(req.UserId); // Logged-in user id

    const AllPosts = await User.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "usersignups",
          let: { postUserId: "$user_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$postUserId"] } } },
            { $project: { _id: 1, firstname: 1, lastname: 1, image: 1 } }, // sirf required fields
          ],
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },

      {
        $addFields: {
          likeCount: { $size: "$likes" },
          isLiked: { $in: [User_Id, "$likes"] },
        },
      },

      {
        $lookup: {
          from: "userfollowers", // collection name of UserFollow model
          let: { postUserId: "$user_id" }, // post ka user
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetuser", "$$postUserId"] }, // jo post ka user hai
                    { $eq: ["$loginUser", User_Id] }, // logged-in user
                    // { $eq: ["$isDeleted", false] }, // soft delete check
                  ],
                },
              },
            },
          ],
          as: "followStatus",
        },
      },

      // 5️⃣ Convert followStatus array → single string or default "Follow"
      {
        $addFields: {
          followStatus: {
            $cond: [
              { $gt: [{ $size: "$followStatus" }, 0] },
              {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: [
                          { $arrayElemAt: ["$followStatus.status", 0] },
                          "accepted",
                        ],
                      },
                      then: "Following",
                    },
                    {
                      case: {
                        $eq: [
                          { $arrayElemAt: ["$followStatus.status", 0] },
                          "Pending",
                        ],
                      },
                      then: "Pending...",
                    },
                  ],
                  default: "Follow",
                },
              },
              "Follow",
            ],
          },
        },
      },
    ]);

    return res.status(200).json({ success: true, data: AllPosts });
  } catch (err) {
    console.error("Get all posts error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports.UserProfileWithPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUserId = new mongoose.Types.ObjectId(id);
    const loginUserId = new mongoose.Types.ObjectId(req.UserId);
  
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await UserInfo.aggregate([
      // 1️⃣ Match User
      {
        $match: { _id: targetUserId },
      },

      // 2️⃣ Get Posts
      {
        $lookup: {
          from: "userposts",
          localField: "_id",
          foreignField: "user_id",
          as: "posts",
        },
      },

      // 3️⃣ Get Friends (only for count)
      {
        $lookup: {
          from: "userfollowers",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$status", "accepted"] }, // ✅ Only accepted
                    {
                      $or: [
                        { $eq: ["$loginUser", "$$userId"] },
                        { $eq: ["$targetuser", "$$userId"] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "friends",
        },
      },

      // 4️⃣ Add Counts
      {
        $addFields: {
          totalPosts: { $size: "$posts" },
          totalFriends: { $size: "$friends" },

          // 🔥 Total Likes Count (sum of all posts likes length)
          totalLikes: {
            $sum: {
              $map: {
                input: "$posts",
                as: "post",
                in: { $size: { $ifNull: ["$$post.likes", []] } },
              },
            },
          },
        },
      },

      // Follow Status lookup

      {
        $lookup: {
          from: "userfollowers",
          let: { targetUserId: "$_id", loginUserId: loginUserId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetuser", "$$targetUserId"] }, // post owner
                    { $eq: ["$loginUser", "$$loginUserId"] }, // logged-in user
                  ],
                },
              },
            },
          ],
          as: "followStatus",
        },
      },

      //  Follow Status Add
      {
        $addFields: {
          followStatus: {
            $let: {
              vars: {
                status: { $arrayElemAt: ["$followStatus.status", 0] },
              },
              in: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$$status", "accepted"] },
                      then: "Following",
                    },
                    {
                      case: { $eq: ["$$status", "Pending"] },
                      then: "Pending...",
                    },
                  ],
                  default: "Follow",
                },
              },
            },
          },
        },
      },
      // 5️⃣ Hide friends array (since only count needed)
      {
        $project: {
          friends: 0,
          password: 0,
          createdAt: 0,
          googleId: 0,
          authProvider: 0,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User data not found",
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Get all profile with post data error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Post ---------------------------------------

module.exports.UserPostController = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "UserPosts", resource_type: "auto" }, // auto for image/video
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream); // buffer se pipe
      });
      uploadedFiles.push(result.secure_url);
    }

    const newPost = await User.create({
      title,
      description,
      image: uploadedFiles, // array of urls
      hashtags,
      user_id: req.UserId,
    });
    return res
      .status(200)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (err) {
    console.error(`User Posts Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

//  Delete

module.exports.UserDeletePostController = async (req, res) => {
  try {
    const { userId } = req.query;
    const delete_user = await User.findByIdAndDelete(userId);
    if (!delete_user) {
      return res.status(404).json({ error: "Id is invalid" });
    }
    return res.status(200).json({ message: "User Successfully Delete" });
  } catch (err) {
    console.error(`Delete data Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

// Update ---------------------

module.exports.UserEditPostController = async (req, res) => {
  try {
    //
    const { title, description, hashtags, existingImages } = req.body;
    const { postId } = req.params;
    const files = req.files;
    //
    const existingPost = await User.findById(postId);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found. Please select post for editing",
      });
    }

    //
    if (title) existingPost.title = title;
    if (description) existingPost.description = description;
    if (hashtags) existingPost.hashtags = hashtags;

    let updatedImages = [];

    if (existingImages) {
      try {
        updatedImages = JSON.parse(existingImages); // existing strings
      } catch {
        updatedImages = [];
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const updatestream = cloudinary.uploader.upload_stream(
            { folder: "E-Commerce_Products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          streamifier.createReadStream(file.buffer).pipe(updatestream); // memory buffer
        });
        updatedImages.push(result.secure_url);
      }
    }

    existingPost.image = updatedImages;

    await existingPost.save();
    return res.status(200).json({
      success: true,
      message: "Post Update Successfully!",
      updateProduct: existingPost,
    });

    // console.log(existingProduct);
  } catch (err) {
    console.error(`Post Updating Error ${err}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.Please try again",
    });
  }
};

// const UserGetDataController = async (req, res) => {
//   try {
//     const User_Id = req.UserId;

//     const GetData = await User.find()
//       .populate("user_id", "firstname lastname image")

//       .sort({ createdAt: -1 });

//     const AllPostsWithLikes = GetData.map((post) => ({
//       ...post.toObject(),
//       likeCount: post.likes.length || 0,
//       isLiked: post.likes.includes(User_Id) || false,
//     }));

//     res.status(200).json(AllPostsWithLikes);
//   } catch (err) {
//     console.error(`Get data Error: ${err}`);
//     return res.status(500).json({ message: "Internal Server error." });
//   }
// };
