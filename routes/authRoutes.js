const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  profile,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
// Middleware
const { isAuth } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

// ------------------------------------------------

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route("/profile").get(isAuth, profile);
router.route("/profile/update").put(isAuth, updateProfile);
router.route("/profile/update/password").put(isAuth, updatePassword);

module.exports = router;
