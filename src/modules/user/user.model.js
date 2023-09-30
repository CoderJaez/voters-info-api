const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

userSchema.pre("save", async function (next) {
  if (!this.isModified()) return next();

  const hash = await bcrypt.hashSync(this.password, 12);

  this.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password).catch((e) => false);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
