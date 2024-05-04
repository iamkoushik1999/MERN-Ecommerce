const express = require("express");
const router = express.Router();
const {
  generateCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { isVendor } = require("../middleware/authMiddleware");

// ------------------------------------------------------------------

// GET
// Generate Coupon
router.route("/generate").get(isVendor, generateCoupon);

// POST
// New Coupon Code
router.route("/coupons").post(isVendor, createCoupon);

// GET
// All Coupon Code
router.route("/coupons").get(isVendor, getCoupons);

// PUT
// Edit Coupon Code
router.route("/coupons").put(isVendor, updateCoupon);

// DELETE
// Delete Coupon Code
router.route("/coupons").delete(isVendor, deleteCoupon);

module.exports = router;
