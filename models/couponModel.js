const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: [
        "Percentage Discount",
        "Fixed Amount Discount",
        "Free Shipping",
        "BOGO",
        "First Purchase Discount",
        "Holiday/Seasonal Discounts",
        "Limited Time Offers",
        "Tiered Discounts",
        "Referral Discounts",
        "Bundle Discounts",
      ],
      required: true,
    },
    discountPercent: {
      type: Number,
    },
    discountAmount: {
      type: Number,
    },
    minimumOrderAmount: {
      type: Number,
    },
    // If coupon is specific to a product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Coupon", couponSchema);
