const bycrypt = require("bcrypt");
const TryCatch = require("../utils/tryCatch");
const {
  CreateOne,
  UpdateOne,
  FindAll,
  FindOne,
  DeleteOne,
} = require("../DataAccess");

const Instructor = require("./instructor.model");
const { default: mongoose } = require("mongoose");
const saltRound = 10;

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    const result = await CreateOne(Instructor, data);

    if (!result) return res.status(500).json({ message: "Save failed" });
    return res.status(200).json({ message: "New Instructor registered" });
  }),
  put: TryCatch(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const result = await UpdateOne(Instructor, id, data);

    if (!result.acknowledged)
      return res
        .status(500)
        .json({ message: "Error updating Instructor info" });
    return res.status(200).json({ message: "Successfully updated" });
  }),
  remove: TryCatch(async (req, res) => {
    const id = req.params.id;

    const result = await DeleteOne(Instructor, id);
    if (!result)
      return res.status(500).json({ message: "Error in deleting Instructor." });

    return res.status(200).json({ message: "Instructor removed successfully" });
  }),
  get: TryCatch(async (req, res) => {
    const filter = req.query;
    const id = req.params.id;
    let result = mongoose.isValidObjectId(id)
      ? await FindOne(Instructor, { _id: id })
      : await FindAll(Instructor, filter);

    if (!result) res.status(500).json({ message: "Instructor info not found" });
    return res.status(200).json(result);
  }),

  changePassword: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    data.password = await bycrypt.hashSync(data.password, saltRound);
  }),
};
