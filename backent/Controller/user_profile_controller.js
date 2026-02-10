// User Info Model
const UserSignUp = require("../Model/user_signup_model");
const User = require("../Model/user_model");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fs = require("fs");
const cloudinary = require("../Cloudinary/CloudinaryConfig");

//
const UserloginSecretKey = process.env.LOGIN_SECRET_KEY;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const GetMyPostController = async (req, res) => {
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

const getUserInfoDataController = async (req, res) => {
  try {
    const user = await UserSignUp.findById(req.UserId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(`Get User Info data Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const getUserPrflImgController = async (req, res) => {
  try {
    const user = await UserSignUp.findById(req.UserId).select("image");
    return res.status(200).json(user); // image path bhi milega
  } catch (err) {
    console.error(`Get user profile image error`, err);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const UserloginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSignUp.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user._id }, UserloginSecretKey, {
      expiresIn: "24h",
    });

    return res.status(200).json({ message: "User Login Successfully", token });
  } catch (err) {
    console.error(`Login Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const UserSignUpController = async (req, res) => {
  try {
    const { firstname, lastname, date_of_birth, gender, email, password } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await UserSignUp.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      date_of_birth: date_of_birth,
      gender: gender,
      password: hashedPassword,
    });
    return res.status(200).json({ message: "Sign up successful!" });
  } catch (err) {
    console.error(`Signup Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const UpdateUserInfoController = async (req, res) => {
  try {
    const { firstname, lastname, date_of_birth, gender } = req.body;
    const User_Id = req.UserId;

    const ExistingUser = await UserSignUp.findById(User_Id);
    if (!ExistingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const UpdateField = {};

    if (firstname) UpdateField.firstname = firstname;
    if (lastname) UpdateField.lastname = lastname;
    if (date_of_birth) UpdateField.date_of_birth = date_of_birth;
    if (gender) UpdateField.gender = gender;

    const UpdateUserProfile = await UserSignUp.findByIdAndUpdate(
      User_Id,
      { $set: UpdateField },
      { new: true },
    );
    return res
      .status(200)
      .json({ message: "User Profile Update successfully!" });
  } catch (err) {
    console.error(`Data Updating error ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const UserProfileUpdateController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const userId = req.UserId;
    const user = await UserSignUp.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "UserProfiles",
    });

    fs.unlinkSync(req.file.path);

    user.image = result.secure_url;
    await user.save();

    // if (req.file) {
    //   user.image = req.file.path;
    //   await user.save();
    // }

    return res
      .status(200)
      .json({ message: "Profile image updated", image: result.secure_url });
  } catch (err) {
    console.error(`User Upload Profile Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error. post" });
  }
};

const googleAuthController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "473953610284-4e4ksvrtu7iurv7rqv7qu0oq3g9fted8.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub } = payload;

    let user = await UserSignUp.findOne({ email });

    if (!user) {
      user = await UserSignUp.create({
        firstname: given_name,
        lastname: family_name,
        email,
        googleId: sub,
        authProvider: "google",
        image: picture,
        password: null, 
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      "UserloginSecretKey", // apni secret key
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      token: jwtToken,
      message: "User Login Successful!",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        image: user.image,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserInfoDataController,
  getUserPrflImgController,
  UserloginController,
  UserSignUpController,
  UpdateUserInfoController,
  UserProfileUpdateController,
  GetMyPostController,
  googleAuthController,
};
