const express = require("express");
const router = express.Router();
const {
  generateCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { isAdmin } = require("../middleware/authMiddleware");

// ------------------------------------------------------------------

// GET
// Generate Coupon
router.route("/generate").get(isAdmin, generateCoupon);

// POST
// New Coupon Code
router.route("/coupons").post(isAdmin, createCoupon);

// GET
// All Coupon Code
router.route("/coupons").get(isAdmin, getCoupons);

// PUT
// Edit Coupon Code
router.route("/coupons").put(isAdmin, updateCoupon);

// DELETE
// Delete Coupon Code
router.route("/coupons").delete(isAdmin, deleteCoupon);

module.exports = router;
