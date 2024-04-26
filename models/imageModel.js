// imageModel.js
const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    image: {
      main: {
        type: String,
      },
      thumbnail: {
        type: String,
      },
      front: {
        type: String,
      },
      back: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Image", imageSchema);
