// Cloudainry Config

const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();


cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});


module.exports = cloudinary;





