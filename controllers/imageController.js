// Packages
const asyncHandler = require("express-async-handler");
// Model
const imageModel = require("../models/imageModel");

// -------------------------------------------------------------------------------------

// Upload Image
// POST
exports.uploadImage = asyncHandler(async (req, res) => {
  const { main, thumbnail, front, back } = req.files;
  if (!main || !thumbnail || !front || !back) {
    res.status(400);
    throw new Error("Select image properly");
  }

  try {
    const images = await imageModel.create({
      image: {
        main: main[0].path,
        thumbnail: thumbnail[0].path,
        front: front[0].path,
        back: back[0].path,
      },
    });

    res.status(201).json({ message: "Image uploaded successfully.", images });
  } catch (error) {
    res.status(500);
    throw new Error("Server error on uploading images");
  }
});
