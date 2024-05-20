const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
