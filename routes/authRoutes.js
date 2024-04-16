const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  profile,
  updateProfile,
  updatePassword,
  addAddress,
} = require("../controllers/authController");
// Middleware
const { isAuth } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

// ------------------------------------------------

// Sign Up
// POST
router.route("/signup").post(upload.single("image"), signup);

// Login
// POST
router.route("/login").post(login);

// View Profile
// GET
router.route("/profile").get(isAuth, profile);

// Edit Profile
// PUT
router.route("/profile/update").put(isAuth, updateProfile);

// Edit Password
// PUT
router.route("/profile/update/password").put(isAuth, updatePassword);

// Add Address
// POST
router.route("/profile/update/address").post(isAuth, addAddress);

module.exports = router;
