const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

// ------------------------------------------------------------------------------------------------------------

// Sign Up
exports.signup = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password, confirmPassword } = req.body;

  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please fill all the fields");
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
