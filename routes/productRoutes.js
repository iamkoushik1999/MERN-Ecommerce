const express = require("express");
const router = express.Router();
// Controllers
const { addProduct, getProducts } = require("../controllers/productController");
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
// Get All Posts
router.route("/products").get(getProducts);

module.exports = router;
