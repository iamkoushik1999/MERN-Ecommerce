// Packages
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
// Model
const vendorModel = require("../models/vendorModel");

// ------------------------------------------------------------------------------------------------------------

// Vendor Sign Up
// POST
exports.vendorSignup = asyncHandler(async (req, res) => {
  const {
    vendorname,
    email,
    code,
    phoneNumber,
    password,
    confirmPassword,
    companyName,
    website,
    businessType,
    reason,
  } = req.body;
  const { image } = req.files;
  const imagePath = image[0].path;

  if (
    !vendorname ||
    !email ||
    !code ||
    !phoneNumber ||
    !password ||
    !confirmPassword ||
    !image ||
    !companyName ||
    !website ||
    !businessType ||
    !reason
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Vendorname Validation
  if (vendorname) {
    if (vendorname.length < 5 || vendorname.length > 20) {
      res.status(400);
      throw new Error("vendorname must be between 5 to 20 characters");
    }
    if (vendorname.includes(" ")) {
      res.status(400);
      throw new Error("vendorname cannot have a space");
    }
    if (vendorname !== vendorname.toLowerCase()) {
      res.status(400);
      throw new Error("vendorname must be in lowercase");
    }
    if (!vendorname.match(/^[a-zA-Z0-9]/)) {
      res.status(400);
      throw new Error("vendorname can only contain letters and numbers");
    }
    const vendornameExists = await vendorModel.findOne({ vendorname });
    if (vendornameExists) {
      res.status(400);
      throw new Error("vendorname already exists");
    }
  }
  // Email Validation
  if (email) {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      res.status(400);
      throw new Error("Please enter valid email");
    }
    const emailExists = await vendorModel.findOne({ email });
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
    const phoneNumberExists = await vendorModel.findOne({ phoneNumber });
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
    const vendorData = await vendorModel.create({
      vendorId: randomBytes(4).toString("hex"),
      vendorname,
      email,
      code,
      phoneNumber,
      password: bcryptPassword,
      image: imagePath,
      companyDetails: {
        companyName,
        website,
        businessType,
      },
      others: {
        reason,
      },
    });

    res
      .status(201)
      .json({ message: "Vendor signed up successfully", vendorData });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// Vendor Login
// POST
exports.vendorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  // , { vendorname: email }, { phoneNumber: email }
  const vendor = await vendorModel.findOne({
    $or: [{ email: email }],
  });
  if (!vendor) {
    res.status(400);
    throw new Error("Invalid Credentials");
  }

  const comparePassword = await bcrypt.compare(password, vendor.password);
  if (!comparePassword) {
    res.status(400);
    throw new Error("Invalid Credentials");
  }

  if (vendor.approve == false) {
    res.status(403);
    throw new Error("You account is still pending approval");
  }

  const token = jwt.sign({ id: vendor._id }, process.env.SECRET_KEY, {
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

// View Profile
// GET
exports.profile = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const vendor = await vendorModel.findById(_id).lean();
  if (!vendor) {
    res.status(404);
    throw new Error("Invalid vendor");
  }
  const { password, ...vendorData } = vendor;

  res.status(200).json({ vendorData });
});
