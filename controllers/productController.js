// Modules
const asyncHandler = require("express-async-handler");
// Models
const productModel = require("../models/productModel");

// -------------------------------------------------------------------------

// POST
// Create Product
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
    shippingCharge,
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
        shippingCharge,
      },
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    throw new Error(error);
  }
});

// GET
// Get Products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const query = {
    ...(req.query.id && { _id: req.query.id }),
    ...(req.query.name && { name: req.query.name }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.brand && { brand: req.query.brand }),
    ...(req.query.manufacturer && { manufacturer: req.query.manufacturer }),
    ...(req.query.status && { status: req.query.status }),
  };
  // All Products
  const products = await productModel.find({ ...query }).lean();
  // Product Count
  const totalProducts = await productModel.countDocuments({ ...query });

  res.status(200).json({ products, totalProducts });
});

// Edit
// Edit Products
exports.editProducts = asyncHandler(async (req, res) => {
  const { id } = req.query;
  // Product for that Vendor
  const product = await productModel.findOne({ _id: id });
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
// Remove Products
exports.removeProducts = asyncHandler(async (req, res) => {
  const { id } = req.query;
  // Product
  const product = await productModel.findOne({ _id: id });
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
  const products = await productModel.find({ ...query }).lean();
  // Count Products
  const totalProducts = await productModel.countDocuments({ ...query });

  res.status(200).json({ products, totalProducts });
});
