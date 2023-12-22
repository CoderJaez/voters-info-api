const mongoose = require("mongoose");

const datastreamSchema = mongoose.Schema(
  {
    latitude: {
      type: String,
      required: [true, "The {PATH} is requried"],
      index: true,
    },
    longitude: {
      type: String,
      required: [true, "The {PATH} is requried"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Datastream = mongoose.model("Datastream", datastreamSchema);

module.exports = { Datastream };
