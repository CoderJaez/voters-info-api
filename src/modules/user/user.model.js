const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "The {PATH} is required."],
    },
    password: {
      type: String,
      required: [true, "The {PATH} is required."],
    },
  },
  {
    timestamp: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
