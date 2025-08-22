const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
} = require("../controllers/userController.js");

router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/:id").get(getUserProfile);

module.exports = router;
