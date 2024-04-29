const express = require("express");
const router = express.Router();
const {
  generateCoupon,
  createCoupon,
} = require("../Controllers/couponController");
const { isAuth } = require("../Middleware/authMiddleware");

// ------------------------------------------------------------------

// GET
// Generate Coupon
router.route("/generate").get(isAuth, generateCoupon);

// POST
// New Coupon Code
router.route("/coupons").post(isAuth, createCoupon);

module.exports = router;
