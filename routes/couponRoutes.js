const express = require("express");
const router = express.Router();
const {
  generateCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
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

// PUT
// Edit Coupon Code
router.route("/coupons").put(isAuth, updateCoupon);

// DELETE
// Delete Coupon Code
router.route("/coupons").delete(isAuth, deleteCoupon);

module.exports = router;
