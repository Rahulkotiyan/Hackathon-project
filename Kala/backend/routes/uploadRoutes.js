const express = require("express");
const upload = require("../config/cloudinary"); // 
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/", protect, upload.single("image"), (req, res) => {
 
  if (req.file) {
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
    });
  } else {
    res.status(400).json({ message: "No file provided or upload failed" });
  }
});

module.exports = router;
