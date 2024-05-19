const express = require("express");
const router = express.Router();
const {
  addToCart,
  viewCart,
  updateCart,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
// Middleware
const { isAuth } = require("../middleware/authMiddleware");

// ------------------------------------------------

// POST
// Add to cart
router.route("/add").post(isAuth, addToCart);

// GET
// View Cart
router.route("/view").get(isAuth, viewCart);

// PUT
// Update Cart
router.route("/update").put(isAuth, updateCart);

// DELETE
// Remove Cart Item
router.route("/remove/:product_id").delete(isAuth, removeCartItem);

// DELETE
// Clear Cart
router.route("/clear").delete(isAuth, clearCart);

module.exports = router;
