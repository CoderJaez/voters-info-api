const mongoose = require("mongoose");
const { isExist } = require("../utils/validator");
const classroomSchema = mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: [true, "${PATH} is required"],
      validate: [
        {
          validator: function (value) {
            return isExist(this, { roomNo: value });
          },
          message: ({ value }) => `The room no ${value} already exist.`,
        },
      ],
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
