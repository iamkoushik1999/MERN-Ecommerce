// Packages
const asyncHandler = require("express-async-handler");
// Models
const couponModel = require("../models/couponModel");
const productModel = require("../models/productModel");

// ------------------------------------------------------------------

// Function to generate random coupon code
function generateCouponCode() {
  const characters1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code1 = "";
  for (let i = 0; i < 6; i++) {
    code1 += characters1.charAt(Math.floor(Math.random() * characters1.length));
  }
  const characters2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code2 = "";
  for (let i = 0; i < 6; i++) {
    code2 += characters2.charAt(Math.floor(Math.random() * characters2.length));
  }
  const characters3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
    maxDiscountAmount,
    minOrderAmount,
    buy,
    free,
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
      maxDiscountAmount,
      minOrderAmount,
      buy,
      free,
      product,
      startDate: startDate ? startDate : Date.now(),
      endDate,
      isActive,
    });
    res.status(201).json({
      message: `Coupon for ${type} created Successfully`,
      coupon,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// GET
// GET Coupon Codes
exports.getCoupons = asyncHandler(async (req, res) => {
  // Vendor Id
  const vendorId = req.user._id;
  const query = {
    ...(req.query.id && { _id: req.query.id }),
    ...(req.query.code && { code: req.query.code }),
    ...(req.query.type && { type: req.query.type }),
    ...(req.query.discountPercent && {
      discountPercent: req.query.discountPercent,
    }),
    ...(req.query.discountAmount && {
      discountAmount: req.query.discountAmount,
    }),
    ...(req.query.product && { product: req.query.product }),
    ...(req.query.startDate && { startDate: req.query.startDate }),
    ...(req.query.endDate && { endDate: req.query.endDate }),
    ...(req.query.isActive && { isActive: req.query.isActive }),
  };
  try {
    const coupons = await couponModel.find({
      $and: [{ ...query }, { vendor: vendorId }],
    });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// EDIT
// Update coupon code
exports.updateCoupon = asyncHandler(async (req, res) => {
  // Vendor Id
  const vendorId = req.user._id;
  const id = req.query.id;

  const coupon = await couponModel.findOne({
    $and: [{ _id: id }, { vendor: vendorId }],
  });
  if (!coupon) {
    res.status(404);
    throw new Error("No Coupon Found");
  }

  try {
    const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Coupon updated Successfully",
      updatedCoupon,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// DELETE
// Delete coupon code
exports.deleteCoupon = asyncHandler(async (req, res) => {
  // Vendor Id
  const vendorId = req.user._id;
  const id = req.query.id;

  const coupon = await couponModel.findOne({
    $and: [{ _id: id }, { vendor: vendorId }],
  });
  if (!coupon) {
    res.status(404);
    throw new Error("No Coupon Found");
  }

  // Check Expiration Date
  if (coupon.endDate && coupon.endDate > Date.now()) {
    res.status(400);
    throw new Error("Coupon has not expired yet, You cannot delete it");
  }

  try {
    await couponModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
