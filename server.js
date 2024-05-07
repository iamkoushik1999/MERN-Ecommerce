const express = require("express");
require("dotenv").config();
require("colors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const { PORT, NODE_ENV } = process.env;
// Database
const connectDB = require("./config/database");
connectDB();
// Imports
const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const productRoutes = require("./routes/productRoutes");
const couponRoutes = require("./routes/couponRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors("*"));

// Middlewares
app.use("/api/v1", authRoutes);
app.use("/api/v1", imageRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", couponRoutes);
app.use("/api/v1/admin", adminRoutes);

// Error Handler
app.use(errorHandler);

// Test Route
app.get("/", (req, res) => {
  res.send(`Server is running successfully ${NODE_ENV}`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} on ${NODE_ENV}`.cyan);
});
