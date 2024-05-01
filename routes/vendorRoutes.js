const express = require("express");
const router = express.Router();
// Controllers
const {
  vendorSignup,
  vendorLogin,
  profile,
} = require("../controllers/vendorController");
// Middleware
const { isVendor } = require("../middleware/authMiddleware");
// Utilities
const { upload } = require("../utilities/cloudinary");

// ------------------------------------------------

// Vendor Sign Up
// POST
router
  .route("/signup")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), vendorSignup);

// Vendor Login
// POST
router.route("/login").post(vendorLogin);

// View Profile
// GET
router.route("/profile").get(isVendor, profile);

module.exports = router;
