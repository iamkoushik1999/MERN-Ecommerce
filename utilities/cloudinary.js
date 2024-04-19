// Packages
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// ENV
const { CLOUDINARY_CLOUDNAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
// ------------------------------------------------

// Cloudinary Config
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDNAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MERN-ecommerce",
    allowed_formats: ["*"],
  },
});

exports.upload = multer({ storage: storage });
