const TryCatch = require("../utils/tryCatch");
const Classroom = require("./classroom.model");
const {
  CreateOne,
  UpdateOne,
  FindAll,
  FindOne,
  DeleteOne,
} = require("../DataAccess");
const mongoose = require("mongoose");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    const result = await CreateOne(Classroom, data);

    if (!result)
      return res.status(500).json({ message: "Error saving classroom" });
    return res
      .status(200)
      .json({ data: result, message: "Classroom created." });
  }),

  get: TryCatch(async (req, res) => {
    const id = req.params.id;
    const filter =
      req.query.roomNo !== undefined
        ? { roomNo: { $regex: req.query.roomNo, $options: "i" } }
        : {};
    let result;
    if (mongoose.isValidObjectId(id)) result = await FindOne(Classroom, id);
    else result = await FindAll(Classroom, filter);

    if (!result)
      return res.status(500).json({ message: "Something went wrong" });
    return res.status(200).json(result);
  }),
  put: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await UpdateOne(Classroom, id, data);

    if (!result)
      return res.status(500).json({ message: "Error update classroom" });

    return res
      .status(200)
      .json({ data: result, message: "Succesfully updated classroom" });
  }),

  deleteOne: TryCatch(async (req, res) => {
    const id = req.params.id;

    const result = await DeleteOne(Classroom, id);
    if (!result)
      return res.status(500).json({ message: "Error deleting classroom" });

    return res.status(200).json({ message: "Successfully deleted classroom" });
  }),
};
