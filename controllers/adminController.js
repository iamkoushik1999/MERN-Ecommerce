// Packages
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
// Model
const adminModel = require("../models/adminModel");

// ------------------------------------------------------------------------------------------------------------

// Signup Admin
// POST
exports.adminSignup = asyncHandler(async (req, res) => {
  const { admin, email, code, phoneNumber, password, confirmPassword } =
    req.body;
  const { image } = req.files;
  const imagePath = image[0].path;

  if (
    !admin ||
    !email ||
    !code ||
    !phoneNumber ||
    !password ||
    !confirmPassword ||
    !image
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Email Validation
  if (email) {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      res.status(400);
      throw new Error("Please enter valid email");
    }
    const emailExists = await adminModel.findOne({ email });
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
    const phoneNumberExists = await adminModel.findOne({ phoneNumber });
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
    const data = await adminModel.create({
      adminId: randomBytes(4).toString("hex"),
      admin,
      email,
      code,
      phoneNumber,
      password: bcryptPassword,
      image: imagePath,
    });

    res.status(201).json({ message: "Admin signed up successfully", data });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// Login Admin
// POST
exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const user = await adminModel.findOne({
    $or: [{ email: email }],
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

  if (user.role !== "admin") {
    res.status(403);
    throw new Error("You are not admin");
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
    .json({ message: "Admin logged In Successfully" });
});

// View Profile
// GET
exports.adminProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await adminModel.findById(_id).lean();
  if (!user) {
    res.status(404);
    throw new Error("Invalid User");
  }
  const { password, ...data } = user;

  res.status(200).json({ data });
});
