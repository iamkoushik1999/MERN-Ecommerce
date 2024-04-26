// imageController
// Packages
const asyncHandler = require("express-async-handler");
// Model
const imageModel = require("../models/imageModel");

// -------------------------------------------------------------------------------------

// Upload Image
// POST
exports.uploadImage = asyncHandler(async (req, res) => {
  try {
    const { main, thumbnail, front, back } = req.files;

    const newImage = new imageModel({
      image: {
        main: main[0].path,
        thumbnail: thumbnail[0].path,
        front: front[0].path,
        back: back[0].path,
      },
    });

    await newImage.save();
    res.status(201).send("Image uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});
