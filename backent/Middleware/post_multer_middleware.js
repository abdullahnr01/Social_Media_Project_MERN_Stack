const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "UploadPostData/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const videoTypes = ["video/mp4", "video/mkv", "video/webm"];

  if (
    imageTypes.includes(file.mimetype) ||
    videoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed!"), false);
  }
};
const PostMulter = multer({ storage, fileFilter });

module.exports = PostMulter;
