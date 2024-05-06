const express = require("express");
const router = express.Router();
// Controllers
const {
  adminSignup,
  adminLogin,
  adminProfile,
} = require("../controllers/adminController");
// Middleware
const { isAdmin } = require("../middleware/authMiddleware");
// Utilities
const { upload } = require("../utilities/cloudinary");

// ------------------------------------------------

// Sign Up
// POST
router
  .route("/signup")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), adminSignup);

// Login
// POST
router.route("/login").post(adminLogin);

// View Profile
// GET
router.route("/profile").get(isAdmin, adminProfile);

module.exports = router;
