const express = require("express");
require("dotenv").config();
require("colors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
// Database
const connectDB = require("./config/database");
connectDB();
// Imports
const errorHandler = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors("*"));

// Test Route
app.get("/", (req, res) => res.send("Server Running Successfully!"));

// Middlewares

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Running on port ${PORT}!`.cyan));
