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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors("*"));

// Middlewares

app.use(errorHandler);

// Test Route
app.get("/", (req, res) => {
  res.send(`Server is running successfully ${NODE_ENV}`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} on ${NODE_ENV}`.cyan);
});
