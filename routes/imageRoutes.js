// imageRoutes.js
const express = require("express");
const router = express.Router();
// Controllers
const { uploadImage } = require("../controllers/imageController");
// Utilities
const { upload } = require("../utilities/cloudinary");

// -------------------------------------------------------------------------------------

// Upload Image
// POST
router.route("/upload").post(
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  uploadImage
);

module.exports = router;
