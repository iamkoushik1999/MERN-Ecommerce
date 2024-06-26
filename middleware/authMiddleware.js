// Packages
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
// Model
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");

// ------------------------------------------------------------------------------------------------------------

// User Auth
exports.isAuth = asyncHandler(async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    res.status(401);
    throw new Error("No Token, Not Authorized");
  }
  try {
    const decoded = await jwt.verify(access_token, process.env.SECRET_KEY);
    req.user = await userModel.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error("Not Authorized");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

// Admin Auth
exports.isAdmin = asyncHandler(async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    res.status(401);
    throw new Error("No Token, Not Authorized");
  }
  try {
    const decoded = await jwt.verify(access_token, process.env.SECRET_KEY);
    req.user = await adminModel.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error("Not Authorized");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized");
  }
});
