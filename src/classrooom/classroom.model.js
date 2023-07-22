const mongoose = require("mongoose");

const classroomSchema = mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: [true, "${PATH} is required"],
    },
    isOccupied: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
