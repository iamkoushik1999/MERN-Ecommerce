// Packages
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
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
  // Phone Number Validation
  if (phoneNumber) {
    if (phoneNumber.length < 10) {
      res.status(400);
      throw new Error("Enter a valid 10 digit Phone Number");
    }
    const phoneNumberExists = await userModel.findOne({ phoneNumber });
    if (phoneNumberExists) {
      res.status(400);
      throw new Error("Phone Number already exists");
    }
  }
  // Password Validation
  if (password) {
    if (password !== confirmPassword) {
      res.status(401);
      throw new Error("Password and Confirm Password should match");
    }

    const minLength = validator.isStrongPassword(password, [{ minLength: 6 }]);

    const minLowercase = validator.isStrongPassword(password, [
      { minLowercase: 1 },
    ]);

    const minUppercase = validator.isStrongPassword(password, [
      { minUppercase: 1 },
    ]);

    const minNumbers = validator.isStrongPassword(password, [
      { minNumbers: 1 },
    ]);

    const minSymbols = validator.isStrongPassword(password, [
      { minSymbols: 1 },
    ]);

    if (!minLength) {
      res.status(400);
      throw new Error("Password must be minimum of 6 characters");
    }
    if (!minLowercase) {
      res.status(400);
      throw new Error("Password should contain 1 lower case character");
    }
    if (!minUppercase) {
      res.status(400);
      throw new Error("Password should contain 1 upper case character");
    }
    if (!minNumbers) {
      res.status(400);
      throw new Error("Password should contain 1 number");
    }
    if (!minSymbols) {
      res.status(400);
      throw new Error("Password should contain 1 symbol");
    }
  }
  // Encrypt Password
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

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const user = await userModel.findOne({
    $or: [{ email: email }, { username: email }, { phoneNumber: email }],
  });
  if (!user) {
    res.status(400);
    throw new Error("Invalid Credentials");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    res.status(400);
    throw new Error("Invalid Credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res
    .status(200)
    .cookie("access_token", token)
    // .cookie("access_token", token, {
    //   httpOnly: true,
    // })
    .json({ message: "Logged In Successfully" });
});

// Profile
exports.profile = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await userModel.findById(_id).lean();
  if (!user) {
    res.status(404);
    throw new Error("Invalid User");
  }
  const { password, ...userData } = user;

  res.status(200).json({ userData });
});
