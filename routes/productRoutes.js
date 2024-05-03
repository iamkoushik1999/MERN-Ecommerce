const express = require("express");
const router = express.Router();
// Controllers
const {
  addProduct,
  getVendorProducts,
  editProducts,
  removeProducts,
  getProducts,
} = require("../controllers/productController");
// Utilities
const { upload } = require("../utilities/cloudinary");
// Middleware
const { isVendor } = require("../middleware/authMiddleware");

// -------------------------------------------------------------------------

// POST
// Create Product
router.route("/products/add").post(
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  isVendor,
  addProduct
);

// GET
// Get Vendor Products
router.route("/vendor/products").get(isVendor, getVendorProducts);

// PUT
// Edit Products
router.route("/products").put(
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  isVendor,
  editProducts
);

// DELETE
// Remove Products
router.route("/products").delete(isVendor, removeProducts);

// GET
// Get All Products
router.route("/products").get(getProducts);

module.exports = router;
