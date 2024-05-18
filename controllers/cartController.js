// External Modules
const asyncHandler = require("express-async-handler");
// Model
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");

// ------------------------------------------------------------------

// POST
// Add to Cart
exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { product_id, quantity } = req.body;
  if (!product_id) {
    res.status(400);
    throw new Error("Please select product properly");
  }
  if (!quantity) {
    res.status(400);
    throw new Error("Please select the quantity");
  }
  const product = await productModel.findById(product_id);
  if (!product) {
    res.status(404);
    throw new Error("No product found");
  }
  // Product Id
  const productId = product._id;

  const cart = await cartModel.findOne({ user: userId });
  try {
    if (cart) {
      const productIndex = cart.product.findIndex(
        (prod) => prod.product == product_id
      );

      if (productIndex > -1) {
        let product = cart.product[productIndex];
        product.quantity += parseInt(quantity);
        await cart.save();

        res.status(200).json({
          message: "Cart updated successfully",
          cart: cart.product,
        });
      } else {
        cart.product.push({
          product: productId,
          quantity,
        });
        await cart.save();

        res.status(200).json({
          message: "Product added to cart successfully",
          cart: cart.product,
        });
      }
    } else {
      const cart = await cartModel.create({
        user: userId,
        product: [
          {
            product: productId,
            quantity,
          },
        ],
      });

      res.status(200).json({
        message: "Product added to cart successfully",
        cart: cart.product,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// GET
// View Cart
exports.viewCart = asyncHandler(async (req, res) => {
  const user = req.user;
  const cart = await cartModel.findOne({ user });
  if (!cart) {
    res.status(404);
    throw new Error("No cart item");
  }

  let cartTotal = 0;

  // Showing Product's Details in Cart
  const cartProducts = await Promise.all(
    cart.product.map(async (item) => {
      const { product, quantity } = item;
      const populatedItem = await productModel
        .findById(product)
        .select("sellerId name MRP shippingDetails")
        .lean();

      // To calculate sub Total
      // Product MRP * Quantity + Shipping Charges
      const { _id, ...rest } = populatedItem;
      const subTotal =
        rest.MRP * quantity + rest.shippingDetails.shippingCharge;
      // To calculate cart total
      // Sum of all sub totals
      cartTotal += subTotal;

      return { product, ...rest, quantity, subTotal };
    })
  );

  res.status(200).json({
    cart: cartProducts,
    cartTotal: parseFloat(cartTotal.toFixed(2)),
  });
});
