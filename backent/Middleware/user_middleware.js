const UserSignUp = require("../Model/user_signup_model");
const jwt = require("jsonwebtoken");

const user_login_middleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let errors = [];

    if (!email || email.trim === "") {
      errors.push("Email is Required - ");
    }
    if (!password || password.trim === "") {
      errors.push("Password is Required - ");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    const user = await UserSignUp.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Wrong email." });
    }

    next();
  } catch (err) {
    console.error(`User Login middleware Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const auth_middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "You are not logged in. Please login to access this resource.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid access. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.LOGIN_SECRET_KEY);
    const { id } = decoded;
    req.UserId = id;
    next();
  } catch (err) {
    console.error(`Authentication error ${err}`);
    return res.status(401).json({
      message: "Session expired or invalid. Please login again.",
    });
  }
};

const user_signUp_middleware = async (req, res, next) => {
  try {
    const { firstname, lastname, gender, date_of_birth, email, password } =
      req.body;
    let errors = [];

    if (!firstname || firstname.trim() === "") {
      errors.push("firstname is Required - ");
    }

      if (!lastname || lastname.trim() === "") {
      errors.push("lastname is Required - ");
    }

    if (!gender || gender.trim() === "") {
      errors.push("Gender is Required - ");
    }
    if (!email || email.trim() === "") {
      errors.push("Email is Required - ");
    }
    if (!date_of_birth || date_of_birth.trim() === "") {
      errors.push("Date of Birth is Required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }

    const user_exist = await UserSignUp.findOne({ email });
    if (user_exist) {
      return res
        .status(409)
        .json({ message: "User already exist this email" });
    }
    next();
  } catch (err) {
    console.error(`User Signup Error: ${err}`);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

module.exports = {
  user_login_middleware,
  auth_middleware,
  user_signUp_middleware,
};
