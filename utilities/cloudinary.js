// Packages
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_CLOUDNAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUDNAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

exports.uploadFile = asyncHandler(async (file) => {
  try {
    const result = (await cloudinary.uploader.upload(file.path)).secure_url;
    return result;
  } catch (error) {
    // res.status(500);
    throw new Error(error);
  }
});
