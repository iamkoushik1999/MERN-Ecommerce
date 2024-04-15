const express = require("express");
const router = express.Router();
const { signup, login, profile } = require("../controllers/authController");
// Middleware
const { isAuth } = require("../middleware/authMiddleware");

// ------------------------------------------------

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/profile").get(isAuth, profile);

module.exports = router;
