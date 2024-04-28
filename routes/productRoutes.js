const express = require("express");
const router = express.Router();
// Controllers
const {
  addProduct,
  getProducts,
  editProducts,
  removeProducts,
} = require("../controllers/productController");
// Utilities
const { upload } = require("../utilities/cloudinary");

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
  addProduct
);

// GET
// Get All Products
router.route("/products").get(getProducts);

// PUT
// Edit Products
router.route("/products").put(editProducts);

// DELETE
// Remove Products
router.route("/products").delete(removeProducts);

module.exports = router;
