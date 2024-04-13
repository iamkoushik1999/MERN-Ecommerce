const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
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
    },
    approve: {
      type: Boolean,
      default: false,
    },
    address: [
      {
        type: {
          type: String,
        },
        street: {
          type: String,
        },
        state: {
          type: String,
        },
        city: {
          type: String,
        },
        zip: {
          type: String,
        },
        country: {
          type: String,
        },
      },
    ],
    others: {
      reason: {
        type: String,
      },
      note: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
