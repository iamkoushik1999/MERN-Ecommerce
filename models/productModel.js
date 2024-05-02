const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vendor",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    images: {
      main: String,
      thumbnail: String,
      front: String,
      back: String,
    },
    taxDetails: {
      tax_name: String,
      tax_type: String,
      tax_percentage: Number,
    },
    metaData: {
      meta_title: String,
      meta_keywords: Array,
      meta_description: String,
    },
    shippingDetails: {
      shipping_charge: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
