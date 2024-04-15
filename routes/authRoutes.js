const express = require("express");
const router = express.Router();
const { signup, login, profile } = require("../controllers/authController");
// Middleware
const { isAuth } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

// ------------------------------------------------

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route("/profile").get(isAuth, profile);

module.exports = router;
