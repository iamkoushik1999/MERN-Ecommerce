const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    approve: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: String,
      default: "0%",
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
