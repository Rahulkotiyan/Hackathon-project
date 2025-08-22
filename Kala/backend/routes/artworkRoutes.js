const express = require("express");
const router = express.Router();
const {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtWork,
  deleteArtwork,
} = require("../controllers/artworkController.js");
const { protect } = require("../middleware/authMiddleware.js");


router.route("/").get(getArtworks);
router.route("/:id").get(getArtworkById);


router.route("/").post(protect, createArtwork);
router.route("/:id").put(protect, updateArtWork).delete(protect, deleteArtwork);

module.exports = router;
