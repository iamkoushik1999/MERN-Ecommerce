const express = require("express");
const router = express.Router();
const {
  generateCoupon,
  createCoupon,
  getCoupons,
} = require("../controllers/couponController");
const { isAuth } = require("../middleware/authMiddleware");

// ------------------------------------------------------------------

// GET
// Generate Coupon
router.route("/generate").get(isAuth, generateCoupon);

// POST
// New Coupon Code
router.route("/coupons").post(isAuth, createCoupon);

// GET
// All Coupon Code
router.route("/coupons").get(isAuth, getCoupons);

module.exports = router;
