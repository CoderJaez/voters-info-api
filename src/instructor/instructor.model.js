const mongoose = require("mongoose");
const { isExist, isValidEmail } = require("../utils/validator");

const instructorSchema = mongoose.Schema(
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
    contact_no: {
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
      default: true,
    },
    role: {
      type: String,
      required: [true, "The {role} is required"],
      enum: {
        values: ["admin", "instructor"],
        message: "The {VALUe} is not supported",
      },
      default: "instructor",
    },
  },
  {
    timestamps: true,
  },
);

instructorSchema.virtual("fullname").get(function () {
  return `${
    this.lastname
  }, ${this.firstname} ${this.middlename !== undefined ? this.middlename : null}`;
});

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
