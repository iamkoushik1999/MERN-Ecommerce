const express = require("express");
const router = express.Router();
// Controllers
const { addProduct } = require("../controllers/productCOntroller");
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

module.exports = router;
