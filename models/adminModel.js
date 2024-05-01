const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    adminId: {
      type: String,
    },
    admin: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    code: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "admin",
    },
    adminInfo: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      age: {
        type: Number,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
