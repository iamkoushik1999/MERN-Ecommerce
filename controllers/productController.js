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
    shipping_charge,
  } = req.body;
  if (!name || !description || !category || !price || !quantity) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const slug = name.split(" ").join("-").toLowerCase();

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
// Get Products
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find();
  if (products.length == 0) {
    res.status(404);
    throw new Error("No product found");
  }

  re.status(200).json(products);
});
