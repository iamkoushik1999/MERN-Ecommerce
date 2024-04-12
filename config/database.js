const mongoose = require("mongoose");
const { NODE_ENV, MONGODB_URL_DEV, MONGODB_URL_TEST, MONGODB_URL_PROD } =
  process.env;

const connectDB = async (req, res) => {
  try {
    if (NODE_ENV == "development") {
      const conn = await mongoose.connect(MONGODB_URL_DEV);
      console.log(`Mongodb connected with ${conn.connection.host}`.cyan);
    } else if (NODE_ENV == "test") {
      const conn = await mongoose.connect(MONGODB_URL_TEST);
      console.log(`Mongodb connected with ${conn.connection.host}`.cyan);
    } else if (NODE_ENV == "test") {
      const conn = await mongoose.connect(MONGODB_URL_PROD);
      console.log(`Mongodb connected with ${conn.connection.host}`.cyan);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log(`Mongodb connected ${NODE_ENV}`.green);
});

mongoose.connection.on("disconnected", () => {
  console.log(`Mongodb disconnected ${NODE_ENV}`.red);
});

module.exports = connectDB;
