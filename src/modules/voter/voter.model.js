const mongoose = require("mongoose");

const voterSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "The {PATH} is requried"],
    index: true,
  },
  lastname: {
    type: String,
    required: [true, "The {PATH} is requried"],
    index: true,
  },
  middlename: {
    type: String,
    default: "",
  },
  ext: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    required: [true, "The {PATH} is requried"],
  },
  address: {
    type: String,
    required: [true, "The {PATH} is required"],
  },
  image_path: {
    type: String,
    default: "",
  },
});

const Voter = mongoose.model("Voter", voterSchema);

module.exports = { Voter };
