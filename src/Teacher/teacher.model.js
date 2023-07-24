const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    lastname: {
      type: String,
      required: [true, "${PATH} is required"],
    },
    firstname: {
      type: String,
      required: [true, "${PATH} is requred"],
    },
    middlename: {
      type: String,
      required: [true, "${PATH} is required"],
    },
    contactNo: {
      type: String,
      required: [true, "${PATH} is required"],
      minLength: [11, "Invalid contact number"],
      maxLength: [10, "Invalid contact number"],
    },
    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
