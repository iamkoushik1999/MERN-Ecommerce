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
      default: "customer",
      enum: ["customer", "vendor"],
    },
    approve: {
      type: Boolean,
      default: false,
    },
    userInfo: {
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
