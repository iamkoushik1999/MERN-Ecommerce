// Packages
const asyncHandler = require("express-async-handler");
// Models
const couponModel = require("../mdels/couponModel");
const productModel = require("../models/productModel");

// ------------------------------------------------------------------

// Function to generate random coupon code
function generateCouponCode() {
  const characters1 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code1 = "";
  for (let i = 0; i < 6; i++) {
    code1 += characters1.charAt(Math.floor(Math.random() * characters1.length));
  }
  const characters2 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code2 = "";
  for (let i = 0; i < 6; i++) {
    code2 += characters2.charAt(Math.floor(Math.random() * characters2.length));
  }
  const characters3 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code3 = "";
  for (let i = 0; i < 6; i++) {
    code3 += characters3.charAt(Math.floor(Math.random() * characters3.length));
  }
  const code = code1 + "-" + code2 + "-" + code3;
  return code;
}

// GET
// Generate Coupon
exports.generateCoupon = asyncHandler(async (req, res) => {
  try {
    const code = generateCouponCode();
    res.status(201).json({ message: "Code Generated Successfully", code });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// POST
// Create new coupon
exports.createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    type,
    discountPercent,
    discountAmount,
    minimumOrderAmount,
    product,
    startDate,
    endDate,
    isActive,
  } = req.body;

  const codeExists = await couponModel.findOne({ code: code });
  if (codeExists) {
    res.status(400);
    throw new Error("Coupon Code already exists");
  }

  if (
    type !== "Percentage Discount" &&
    type !== "Fixed Amount Discount" &&
    type !== "Free Shipping" &&
    type !== "BOGO" &&
    type !== "First Purchase Discount" &&
    type !== "Holiday/Seasonal Discounts" &&
    type !== "Limited Time Offers" &&
    type !== "Tiered Discounts" &&
    type !== "Referral Discounts" &&
    type !== "Bundle Discounts"
  ) {
    res.status(400);
    throw new Error("Please select correct coupon type");
  }

  if (discountPercent > 80) {
    res.status(400);
    throw new Error("Discount Percentage cannot be more that 80%");
  }
  if (discountAmount > 100) {
    res.status(400);
    throw new Error("Discount Amount cannot be more that 100");
  }

  if (product) {
    const product = await productModel.findOne({ _id: product });
    if (!product) {
      res.status(404);
      throw new Error("No product found");
    }
  }

  try {
    const coupon = await couponModel.create({
      code,
      type,
      discountPercent,
      discountAmount,
      minimumOrderAmount,
      product,
      startDate: startDate ? startDate : Date.now(),
      endDate,
      isActive,
    });
    res.status(201).json({ message: "Coupon created Successfully", coupon });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
