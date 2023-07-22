const mongoose = require("mongoose");
require("dotenv/config");
const { UNAME, PASS, DB_NAME, ENV } = process.env;

const DEV_MONGO_URI = `mongodb://127.0.0.1/${DB_NAME}`;
const PROD_MONGO_URI = `mongodb://admin:admin@ec2-18-141-205-53.ap-southeast-1.compute.amazonaws.com/${DB_NAME}`;

const MONGO_URI = ENV === "production" ? PROD_MONGO_URI : DEV_MONGO_URI;
const connection = mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connection is ready.");
  })
  .catch((err) => console.error("ERROR: ", err.message));

module.exports = connection;
