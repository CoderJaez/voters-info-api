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
  votersId: {
    type: String,
    required: [true, "The {PATH} is required"],
    index: true,
  },
  address: {
    type: String,
    required: [true, "The {PATH} is required"],
  },
  city: {
    type: String,
    required: [true, "The {PATH} is required"],
  },
  province: {
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
