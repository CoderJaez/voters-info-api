const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Instructor",
      required: [true, "The {PATH} is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
