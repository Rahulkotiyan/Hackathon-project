const express = require("express");
const router = express.Router();
const {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  updateVerificationStatus
} = require("../controllers/artworkController.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require('../config/cloudinary.js');


router.route("/").get(getArtworks);
router.route("/:id").get(getArtworkById);


router.route("/").post(protect, createArtwork);
router.route("/:id").put(protect, updateArtwork).delete(protect, deleteArtwork);
router.route("/").post(protect,upload.single('image'),createArtwork);

module.exports = router;
