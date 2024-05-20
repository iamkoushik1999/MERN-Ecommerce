// Packages
const asyncHandler = require("express-async-handler");
// Models
const couponModel = require("../models/couponModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");

// ------------------------------------------------------------------

// Function to generate random coupon code
function generateCouponCode() {
  const characters1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code1 = "";
  for (let i = 0; i < 6; i++) {
    code1 += characters1.charAt(Math.floor(Math.random() * characters1.length));
  }
  const characters2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code2 = "";
  for (let i = 0; i < 6; i++) {
    code2 += characters2.charAt(Math.floor(Math.random() * characters2.length));
  }
  const characters3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code3 = "";
  for (let i = 0; i < 6; i++) {
    code3 += characters3.charAt(Math.floor(Math.random() * characters3.length));
  }
  const code = code1 + "-" + code2 + "-" + code3;
  return code;
}

// GET
// Generate Coupon
exports.generateCoupon = asyncHandler(async (req, res) => {
  try {
    const code = generateCouponCode();
    res.status(201).json({ message: "Code Generated Successfully", code });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// POST
// Create new coupon
exports.createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    type,
    discountPercent,
    discountAmount,
    maxDiscountAmount,
    minOrderAmount,
    buy,
    free,
    product,
    startDate,
    endDate,
    isActive,
    description,
  } = req.body;

  const codeExists = await couponModel.findOne({ code: code });
  if (codeExists) {
    res.status(400);
    throw new Error("Coupon Code already exists");
  }

  if (
    type !== "Percentage Discount" &&
    type !== "Fixed Amount Discount" &&
    type !== "Free Shipping" &&
    type !== "BOGO" &&
    type !== "First Purchase Discount" &&
    type !== "Holiday/Seasonal Discounts" &&
    type !== "Limited Time Offers" &&
    type !== "Tiered Discounts" &&
    type !== "Referral Discounts" &&
    type !== "Bundle Discounts"
  ) {
    res.status(400);
    throw new Error("Please select correct coupon type");
  }

  if (maxDiscountAmount && minOrderAmount) {
    if (maxDiscountAmount >= minOrderAmount) {
      res.status(400);
      throw new Error(
        "Maximum discount amount cannot be higher than minimum order amount"
      );
    }
  }

  if (discountPercent > 80) {
    res.status(400);
    throw new Error("Discount Percentage cannot be more that 80%");
  }

  if (product) {
    const product = await productModel.findOne({ _id: product });
    if (!product) {
      res.status(404);
      throw new Error("No product found");
    }
  }

  try {
    const coupon = await couponModel.create({
      code,
      type,
      discountPercent,
      discountAmount,
      maxDiscountAmount,
      minOrderAmount,
      buy,
      free,
      product,
      startDate: startDate ? startDate : Date.now(),
      endDate,
      isActive,
      description,
    });
    res.status(201).json({
      message: `Coupon for ${type} created Successfully`,
      coupon,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// GET
// GET Coupon Codes
exports.getCoupons = asyncHandler(async (req, res) => {
  const query = {
    ...(req.query.id && { _id: req.query.id }),
    ...(req.query.code && { code: req.query.code }),
    ...(req.query.type && { type: req.query.type }),
    ...(req.query.product && { product: req.query.product }),
    ...(req.query.isActive && { isActive: req.query.isActive }),
  };

  // Handle discountPercent Range
  if (req.query.discountPercentMin || req.query.discountPercentMax) {
    query.discountPercent = {};
    if (req.query.discountPercentMin) {
      query.discountPercent.$gte = req.query.discountPercentMin;
    }
    if (req.query.discountPercentMax) {
      query.discountPercent.$lte = req.query.discountPercentMax;
    }
  }

  // Handle endDate Range
  if (req.query.filterStartingDate && req.query.filterEndingDate) {
    query.endDate = {
      $gte: req.query.filterStartingDate,
      $lte: req.query.filterEndingDate,
    };
  }

  try {
    const coupons = await couponModel.find({ ...query });
    const totalCoupons = await couponModel.countDocuments({ ...query });
    res.status(200).json({ coupons, totalCoupons });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// EDIT
// Update coupon code
exports.updateCoupon = asyncHandler(async (req, res) => {
  const id = req.query.id;

  const coupon = await couponModel.findOne({ _id: id });
  if (!coupon) {
    res.status(404);
    throw new Error("No Coupon Found");
  }

  try {
    const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Coupon updated Successfully",
      updatedCoupon,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// DELETE
// Delete coupon code
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.query.id;

  const coupon = await couponModel.findOne({ _id: id });
  if (!coupon) {
    res.status(404);
    throw new Error("No Coupon Found");
  }

  try {
    await couponModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// POST
// Apply Coupon
exports.applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { code } = req.body;

  const user = await userModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  // Check if the user has products in the cart
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  // Find the coupon by code
  const coupon = await couponModel.findOne({ code: code }).populate("product");
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  // Check if coupon is active
  if (!coupon.isActive) {
    res.status(400);
    throw new Error("Coupon is not active");
  }

  // Check if coupon has started yet or not
  if (coupon.startDate && coupon.startDate > Date.now()) {
    res.status(400);
    throw new Error("Coupon is not active yet");
  }

  // Check if coupon has expired
  if (coupon.endDate && coupon.endDate < Date.now()) {
    res.status(400);
    throw new Error("Coupon has expired");
  }

  // Coupon Type
  const couponType = coupon.type;

  // cart Total
  let cartTotal = 0;
  // Total cart Quantity
  let cartQuantity = 0;

  // cart Products
  const cartProducts = await Promise.all(
    cart.product.map(async (item) => {
      const { product, quantity } = item;
      const populatedItem = await productModel
        .findById(product)
        .select("name price shippingDetails")
        .lean();

      // To calculate sub Total
      // Product MRP * Quantity + Shipping Charges
      const { _id, ...rest } = populatedItem;
      const subTotal =
        rest.MRP * quantity + rest.shippingDetails.shippingCharge;
      // To calculate cart total
      // Sum of all sub totals
      cartTotal += subTotal;
      // To calculate cart total Quantity
      // Sum of all product's quantity
      cartQuantity += quantity;

      return {
        product,
        ...rest,
        quantity,
        subTotal: parseFloat(subTotal.toFixed(2)),
      };
    })
  );

  // Coupon applied true on those that were coupon applied
  const couponApplied = cartProducts.map((product) => {
    const appliedProduct = cartProducts.find(
      (cp) => cp.product === product.product
    );
    if (appliedProduct) {
      return {
        ...product,
        couponApplied: true,
      };
    } else {
      return {
        ...product,
        couponApplied: false,
      };
    }
  });

  // Changeable Amounts
  let discountAmount = 0;
  let finalTotal = 0;
  // Coupon Apply Message
  const message = "Coupon applied successfully";

  switch (couponType) {
    // For BOGO, apply on products
    case "BOGO":
      const canBuy = coupon.buy;
      const canGet = coupon.free;
      if (cartQuantity < canBuy + canGet) {
        res.status(400);
        throw new Error(
          "Not applicable as cart products are less than coupon products"
        );
      }

      // Sorting via MRP
      cartProducts.sort((a, b) => a.MRP - b.MRP);
      // Cheapest Product's Prices
      let cheapestProducts = [];
      let free = canGet;
      // Loop through the sorted products and add the cheapest ones to the list
      for (let i = 0; i < cartProducts.length; i++) {
        const product = cartProducts[i];
        if (free > 0) {
          const quantityToAdd = Math.min(product.quantity, free);
          cheapestProducts.push({ ...product, quantity: quantityToAdd });
          free -= quantityToAdd;
        } else {
          break;
        }
      }

      for (let i = 0; i < cheapestProducts.length; i++) {
        const discountedPrice = cheapestProducts[i].MRP;
        cheapestProducts[i].discountedPrice = discountedPrice;
        if (cheapestProducts[i].quantity > 1) {
          discountAmount += discountedPrice * cheapestProducts[i].quantity;
        } else {
          discountAmount +=
            discountedPrice * cheapestProducts[i].quantity +
            cheapestProducts[i].shippingDetails.shippingCharge;
        }
      }

      const bogoProducts = couponApplied.map((product) => {
        // Adding free: true tag to products whose price is free
        const freeProduct = cheapestProducts.find(
          (cp) => cp.product === product.product
        );
        if (freeProduct) {
          return {
            ...product,
            free: true,
          };
        } else {
          return {
            ...product,
            free: false,
          };
        }
      });

      // Final Total after discount
      finalTotal = cartTotal - discountAmount;

      res.status(200).json({
        message:
          NODE_ENV === "production"
            ? `${message} for buy ${canBuy} get ${canGet} free`
            : `${message} for buy ${canBuy} get ${canGet} free | ${couponType}`,
        cart: bogoProducts,
        cartTotal: parseFloat(cartTotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      });
      break;
    // ------------------------------------------------------------------------------------
    // For Bundle Discounts, apply on products
    case "Bundle Discount":
      // Calculate discount for each product in cart
      const product = cart.product.map((prod) => {
        let discountAmount = 0;
        if (coupon.product._id.toString() == prod.product.toString()) {
          prod.subTotal -= (prod.MRP * coupon.discountPercent) / 100;
          discountAmount = (prod.MRP * coupon.discountPercent) / 100;
        }

        return {
          ...prod._doc,
          discountAmount,
        };
      });

      // Total Discount Amount
      const totalDiscountAmount = product.reduce(
        (total, product) => total + product.discountAmount,
        0
      );
      // Final Total after discount
      finalTotal = product.reduce(
        (total, product) => total + product.subTotal,
        0
      );

      res.status(200).json({
        message:
          NODE_ENV === "production" ? `${message}` : `${message} ${couponType}`,
        cart: product,
        cartTotal: parseFloat(cartTotal.toFixed(2)),
        discountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      });
      break;
    // ------------------------------------------------------------------------------------
    // For Percentage Discount, Discount Amount will be ( MRP - that product's price )
    case "Percentage Discount":
      // Check if coupon has any minimum order amount criteria
      if (coupon.minOrderAmount) {
        // If minimum order amount is there then
        // Check if cart order is greater than minimum order amount
        if (cartTotal >= coupon.minOrderAmount) {
          // If cart total is greater then percentage will be applicable
          if (
            (coupon.discountPercent / 100) * cartTotal >=
            coupon.maxDiscountAmount
          ) {
            // If applied percentage amount is greater then maximum discount
            // Then maximum discount order will be the main discount amount
            discountAmount = coupon.maxDiscountAmount;
          } else {
            // If applied percentage amount is not greater then maximum discount
            // Then percentage amount will be the main discount amount
            discountAmount = (coupon.discountPercent / 100) * cartTotal;
          }
        } else {
          // if cart order is not greater than minimum order amount
          // Then coupon will not apply
          res.status(400);
          throw new Error(
            "Not applicable as cart total is less than coupon offer"
          );
        }
      } else {
        // If coupon doesnot have any minimum order amount criteria
        // Then percentage amount will be the main discount amount
        discountAmount = (coupon.discountPercent / 100) * cartTotal;
      }
      // Final Total after discount
      finalTotal = cartTotal - discountAmount;

      res.status(200).json({
        message:
          NODE_ENV === "production"
            ? `${message} with ${coupon.discountPercent}% discount`
            : `${message} with ${coupon.discountPercent}% discount | ${couponType}`,
        cart: couponApplied,
        cartTotal: parseFloat(cartTotal.toFixed(2)),
        discountPercent: `${coupon.discountPercent}%`,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      });
      break;
    // For Fixed Amount Discount, Discount Amount will be ( Coupon Discount amount )
    case "Fixed Amount Discount":
      if (cartTotal > coupon.minOrderAmount) {
        discountAmount = coupon.discountAmount;

        // Final Total after discount
        finalTotal = cartTotal - discountAmount;

        res.status(200).json({
          message:
            NODE_ENV === "production"
              ? `${message} for $${coupon.discountAmount} discount`
              : `${message} for $${coupon.discountAmount} discount | ${couponType}`,
          cart: couponApplied,
          cartTotal: parseFloat(cartTotal.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          finalTotal: parseFloat(finalTotal.toFixed(2)),
        });
      } else {
        res.status(400);
        throw new Error(
          `Your total amount is not more than ${coupon.minOrderAmount}`
        );
      }
      break;
    // For Free Shipping, Discount Amount will be ( shippingCharges = 0 )
    case "Free Shipping":
      if (cartTotal > coupon.minOrderAmount) {
        const freeShippingProducts = cartProducts.filter(
          ({ shippingDetails }) => shippingDetails.freeShipping
        );

        discountAmount = freeShippingProducts.reduce(
          (total, product) => total + product.shippingDetails.shippingCharge,
          0
        );

        // Final Total after discount
        finalTotal = cartTotal - discountAmount;

        // Free Shipping Tag
        const productFreeShipping = couponApplied.map((product) => {
          const freeShipping = freeShippingProducts.find(
            (fs) => fs.product === product.product
          );
          if (freeShipping) {
            return {
              ...product,
              freeShipping: true,
            };
          } else {
            return product;
          }
        });

        res.status(200).json({
          message:
            NODE_ENV === "production"
              ? `${message}`
              : `${message} ${couponType}`,
          cart: productFreeShipping,
          cartTotal: parseFloat(cartTotal.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          finalTotal: parseFloat(finalTotal.toFixed(2)),
        });
      } else {
        res.status(400);
        throw new Error(
          `Your total amount is not more than ${coupon.minOrderAmount}`
        );
      }
      break;
    // For First Purchase Discount, Discount Amount will be ( Discount Percent / 100 ) * cart Total
    case "First Purchase Discount":
      const orders = await orderModel.find({ user: userId });
      if (orders.length >= 1) {
        res.status(400);
        throw new Error("This coupon does not exists for you");
      }
      discountAmount = (coupon.discountPercent / 100) * cartTotal;

      // Final Total after discount
      finalTotal = cartTotal - discountAmount;

      res.status(200).json({
        message:
          NODE_ENV === "production"
            ? `${message} with ${coupon.discountPercent}% discount`
            : `${message} with ${coupon.discountPercent}% discount | ${couponType}`,
        cart: couponApplied,
        cartTotal: parseFloat(cartTotal.toFixed(2)),
        discountPercent: `${coupon.discountPercent}%`,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      });
      break;
    // For Holiday/Seasonal Discounts, Discount Amount will be ( Discount Percent / 100 ) * cart Total
    case "Holiday/Seasonal Discounts":
      // Check if coupon has any minimum order amount criteria
      if (coupon.minOrderAmount) {
        // If minimum order amount is there then
        // Check if cart order is greater than minimum order amount
        if (cartTotal >= coupon.minOrderAmount) {
          // If cart total is greater then percentage will be applicable
          if (
            (coupon.discountPercent / 100) * cartTotal >=
            coupon.maxDiscountAmount
          ) {
            // If applied percentage amount is greater then maximum discount
            // Then maximum discount order will be the main discount amount
            discountAmount = coupon.maxDiscountAmount;
          } else {
            // If applied percentage amount is not greater then maximum discount
            // Then percentage amount will be the main discount amount
            discountAmount = (coupon.discountPercent / 100) * cartTotal;
          }
        } else {
          // if cart order is not greater than minimum order amount
          // Then coupon will not apply
          res.status(400);
          throw new Error(
            "Not applicable as cart total is less than coupon offer"
          );
        }
      } else {
        // If coupon doesnot have any minimum order amount criteria
        // Then percentage amount will be the main discount amount
        discountAmount = (coupon.discountPercent / 100) * cartTotal;
      }
      // Final Total after discount
      finalTotal = cartTotal - discountAmount;

      res.status(200).json({
        message:
          NODE_ENV === "production"
            ? `${message} with ${coupon.discountPercent}% discount`
            : `${message} with ${coupon.discountPercent}% discount | ${couponType}`,
        cart: couponApplied,
        cartTotal: parseFloat(cartTotal.toFixed(2)),
        discountPercent: `${coupon.discountPercent}%`,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      });
      break;
    // For Limited Time Offers, Discount Amount will be ( Discount Percent / 100 ) * cart Total
    case "Limited Time Offers":
      // Check if coupon has any minimum order amount criteria
      if (coupon.minOrderAmount) {
        // If minimum order amount is there then
        // Check if cart order is greater than minimum order amount
        if (cartTotal >= coupon.minOrderAmount) {
          // If cart total is greater then percentage will be applicable
          if (
            (coupon.discountPercent / 100) * cartTotal >=
            coupon.maxDiscountAmount
          ) {
            // If applied percentage amount is greater then maximum discount
            // Then maximum discount order will be the main discount amount
            discountAmount = coupon.maxDiscountAmount;
          } else {
            // If applied percentage amount is not greater then maximum discount
            // Then percentage amount will be the main discount amount
            discountAmount = (coupon.discountPercent / 100) * cartTotal;
          }
        } else {
          // if cart order is not greater than minimum order amount
          // Then coupon will not apply
          res.status(400);
          throw new Error(
            "Not applicable as cart total is less than coupon offer"
          );
        }
      } else {
        // If coupon doesnot have any minimum order amount criteria
        // Then percentage amount will be the main discount amount
        discountAmount = (coupon.discountPercent / 100) * cartTotal;
      }
      // Final Total after discount
      finalTotal = cartTotal - discountAmount;

      res.status(200).json({
        message:
          NODE_ENV === "production"
            ? `${message} with ${coupon.discountPercent}% discount`
            : `${message} with ${coupon.discountPercent}% discount | ${couponType}`,
        cart: couponApplied,
        cartTotal: parseFloat(cartTotal.toFixed(2)),
        discountPercent: `${coupon.discountPercent}%`,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      });
      break;
    // For Tiered Discounts, Discount Amount will be ( Coupon Discount Amount )
    case "Tiered Discounts":
      if (cartTotal > coupon.minOrderAmount) {
        discountAmount = coupon.discountAmount;

        // Final Total after discount
        finalTotal = cartTotal - discountAmount;

        res.status(200).json({
          message:
            NODE_ENV === "production"
              ? `${message} for $${coupon.discountAmount} discount`
              : `${message} for $${coupon.discountAmount} discount | ${couponType}`,
          cart: couponApplied,
          cartTotal: parseFloat(cartTotal.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          finalTotal: parseFloat(finalTotal.toFixed(2)),
        });
      } else {
        res.status(400);
        throw new Error(
          `Your total amount is not more than ${coupon.minOrderAmount}`
        );
      }
      break;
    // For Referral Discounts, Discount Amount will be (  )
    case "Referral Discounts":
      res.status(400);
      throw new Error(`Cannot use now`);
  }
});
