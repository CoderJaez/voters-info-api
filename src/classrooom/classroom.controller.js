const TryCatch = require("../utils/tryCatch");
const {
  CreateOne,
  UpdateOne,
  FindAll,
  FindOne,
  DeleteOne,
} = require("./classroom.service");
const mongoose = require("mongoose");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    const result = await CreateOne(data);

    if (!result)
      return res.status(500).json({ message: "Error saving classroom" });
    return res
      .status(200)
      .json({ data: result, message: "Classroom created." });
  }),

  get: TryCatch(async (req, res) => {
    const id = req.params.id;
    const filter = req.query ? req.query : {};

    let result;
    if (mongoose.isValidObjectId(id)) result = await FindOne(id);
    else result = await FindAll(filter);

    if (!result)
      return res.status(500).json({ message: "Something went wrong" });
    return res.status(200).json(result);
  }),
  put: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await UpdateOne(id, data);

    if (!result)
      return res.status(500).json({ message: "Error update classroom" });

    return res
      .status(200)
      .json({ data: result, message: "Succesfully updated classroom" });
  }),

  deleteOne: TryCatch(async (req, res) => {
    const id = req.params.id;

    const result = await DeleteOne(id);
    if (!result)
      return res.status(500).json({ message: "Error deleting classroom" });

    return res.status(200).json({ message: "Successfully deleted classroom" });
  }),
};
