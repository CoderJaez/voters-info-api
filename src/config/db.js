const mongoose = require("mongoose");
require("dotenv/config");
const { UNAME, PASS, DB_NAME, ENV } = process.env;

const DEV_MONGO_URI = `mongodb://127.0.0.1/${DB_NAME}`;
const PROD_MONGO_URI = `mongodb+srv://${UNAME}:${PASS}@cluster0.sh1oc.mongodb.net/${DB_NAME}`;
const MONGO_URI = ENV === "production" ? PROD_MONGO_URI : DEV_MONGO_URI;
const connection = mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connection is ready.");
  })
  .catch((err) => console.error("ERROR: ", err.message));

module.exports = connection;
