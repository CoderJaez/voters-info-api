const mongoose = require("mongoose");
const { isExist, isValidEmail } = require("../utils/validator");

const teacherSchema = mongoose.Schema(
  {
    lastname: {
      type: String,
      required: [true, "The {PATH} is required"],
    },
    firstname: {
      type: String,
      required: [true, "The {PATH} is requred"],
    },
    middlename: {
      type: String,
    },
    contactNo: {
      type: String,
      required: [true, "The {PATH} is required"],
      minLength: [11, "Invalid contact number"],
      maxLength: [12, "Invalid contact number"],
    },
    image: {
      filename: { type: String, default: "" },
      path: { type: String, default: "" },
    },
    email: {
      type: String,
      required: [true, "The {PATH} is required"],
      validate: [
        {
          validator: function (value) {
            return isValidEmail(value);
          },
          message: () => "Invalid email",
        },
        {
          validator: function (value) {
            return isExist(this, { email: value });
          },
          message: ({ value }) => `The email ${value} already exist.`,
        },
      ],
    },
    password: {
      type: String,
      required: [true, "The {PATH} is required"],
      minLength: [8, "The {PATH} must at least 8 characters"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

teacherSchema.virtual("fullname").get(function () {
  return `${
    this.lastname
  }, ${this.firstname} ${this.middlename !== undefined ? this.middlename : null}`;
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
