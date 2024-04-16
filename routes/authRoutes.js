const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  profile,
  updateProfile,
} = require("../controllers/authController");
// Middleware
const { isAuth } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

// ------------------------------------------------

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route("/profile").get(isAuth, profile);
router.route("/profile/update").put(isAuth, updateProfile);

module.exports = router;
