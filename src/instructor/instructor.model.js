const mongoose = require("mongoose");
const { isExist, isValidEmail } = require("../utils/validator");
const bcrypt = require("bcrypt");

const instructorSchema = mongoose.Schema(
  {
    lastname: {
      type: String,
      required: [true, "The {PATH} is required"],
      index: true,
    },
    firstname: {
      type: String,
      required: [true, "The {PATH} is requred"],
      index: true,
    },
    middlename: {
      type: String,
      default: "",
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

instructorSchema.pre("save", async function (next) {
  if (!this.isModified()) return next();

  const hash = await bcrypt.hashSync(this.password, 12);

  this.password = hash;
  return next();
});

instructorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password).catch((e) => false);
};

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
