// Modules
const asyncHandler = require("express-async-handler");
// Models
const productModel = require("../models/productModel");

// -------------------------------------------------------------------------

// POST
// Create Product -> Vendor
exports.addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    price,
    quantity,
    brand,
    manufacturer,
    tax_name,
    tax_type,
    tax_percentage,
    meta_title,
    meta_keywords,
    meta_description,
    shipping_charge,
  } = req.body;
  if (!name || !description || !category || !price || !quantity) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // Check if product name exists
  const nameExists = await productModel.findOne({ name: name });
  if (nameExists) {
    res.status(400);
    throw new Error("Product already exists");
  }

  // Product Slug
  const slug = name.split(" ").join("-").toLowerCase();

  // Checking for all image upload
  const { main, thumbnail, front, back } = req.files;
  if (!main || !thumbnail || !front || !back) {
    res.status(400);
    throw new Error("Please select all images");
  }

  try {
    const product = await productModel.create({
      name,
      description,
      slug: slug,
      category,
      price,
      quantity,
      brand,
      manufacturer,
      images: {
        main: main[0].path,
        thumbnail: thumbnail[0].path,
        front: front[0].path,
        back: back[0].path,
      },
      taxDetails: {
        tax_name,
        tax_type,
        tax_percentage,
      },
      metaData: {
        meta_title,
        meta_keywords,
        meta_description,
      },
      shippingDetails: {
        shipping_charge,
      },
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    throw new Error(error);
  }
});

// GET
// Get Products -> Vendor
exports.getVendorProducts = asyncHandler(async (req, res) => {
  // Vendor Id
  const vendorId = req.user._id;
  const query = {
    ...(req.query.id && { _id: req.query.id }),
    ...(req.query.name && { name: req.query.name }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.brand && { brand: req.query.brand }),
    ...(req.query.manufacturer && { manufacturer: req.query.manufacturer }),
    ...(req.query.status && { status: req.query.status }),
  };
  // Products for that Vendor
  const products = await productModel
    .find({ $and: [{ ...query }, { vendor: vendorId }] })
    .lean();

  const totalProducts = await productModel.countDocuments();

  res.status(200).json({ products, totalProducts });
});

// Edit
// Edit Products -> Vendor
exports.editProducts = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { id } = req.query;
  // Product for that Vendor
  const product = await productModel.findOne({
    $and: [{ _id: id }, { vendor: vendorId }],
  });
  if (!product) {
    res.status(404);
    throw new Error("No product found");
  }

  const prod_id = product._id;

  // Check if product name exists
  const nameExists = await productModel.findOne({ name: req.body.name });
  if (nameExists) {
    res.status(400);
    throw new Error("Product already exists");
  }

  // Product Update with image check
  const { main, thumbnail, front, back } = req.files;
  const updateObject = Object.assign(
    {
      "images.main": main ? main[0].path : main,
      "images.thumbnail": thumbnail ? thumbnail[0].path : thumbnail,
      "images.front": front ? front[0].path : front,
      "images.back": back ? back[0].path : back,
    },
    req.body
  );

  try {
    const updatedProduct = await productModel
      .findByIdAndUpdate(prod_id, updateObject, {
        new: true,
      })
      .lean();

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// DELETE
// Remove Products -> Vendor
exports.removeProducts = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { id } = req.query;
  // Product for that Vendor
  const product = await productModel.findOne({
    $and: [{ _id: id }, { vendor: vendorId }],
  });
  if (!product) {
    res.status(404);
    throw new Error("No product found");
  }

  const prod_id = product._id;

  try {
    await productModel.findByIdAndDelete(prod_id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// GET
// Get Products -> All
exports.getProducts = asyncHandler(async (req, res) => {
  const query = {
    ...(req.query.id && { _id: req.query.id }),
    ...(req.query.name && { name: req.query.name }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.brand && { brand: req.query.brand }),
    ...(req.query.manufacturer && { manufacturer: req.query.manufacturer }),
    ...(req.query.status && { status: req.query.status }),
  };
  // All Products
  const products = await productModel
    .find({ ...query })
    .populate("vendor", "-_id vendorname companyDetails")
    .lean();

  const totalProducts = await productModel.countDocuments();

  res.status(200).json({ products, totalProducts });
});
