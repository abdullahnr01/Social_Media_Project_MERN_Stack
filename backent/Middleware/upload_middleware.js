const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Upload/"); // files yahi save hongi
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp + original name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ✅ Multer middleware
const upload = multer({ storage });

module.exports = upload;
