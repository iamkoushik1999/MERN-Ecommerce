// Packages
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// Model
const userModel = require("../models/userModel");
// Utilities

// ------------------------------------------------------------------------------------------------------------

// Sign Up
exports.signup = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password, confirmPassword } = req.body;

  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Username Validation
  if (username) {
    if (username.length < 5 || username.length > 20) {
      res.status(400);
      throw new Error("Username must be between 5 to 20 characters");
    }
    if (username.includes(" ")) {
      res.status(400);
      throw new Error("Username cannot have a space");
    }
    if (username !== username.toLowerCase()) {
      res.status(400);
      throw new Error("Username must be in lowercase");
    }
    if (!username.match(/^[a-zA-Z0-9]/)) {
      res.status(400);
      throw new Error("Username can only contain letters and numbers");
    }
    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) {
      res.status(400);
      throw new Error("Username already exists");
    }
  }
  // Email Validation
  if (email) {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      res.status(400);
      throw new Error("Please enter valid email");
    }
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already exists");
    }
  }

  const bcryptPassword = await bcrypt.hash(password, 10);

  try {
    const userData = await userModel.create({
      username,
      email,
      phoneNumber,
      password: bcryptPassword,
    });

    res.status(201).json({ message: "User signed up successfully", userData });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});
