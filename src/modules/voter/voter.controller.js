const { Voter } = require("./voter.model");
const TryCatch = require("../../utils/tryCatch");
const User = require("../user/user.model");
const mongoose = require("mongoose");
const DataAccess = require("../../DataAccess");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    let result = new Voter(data);

    result = await result.save();
    if (!result)
      return res.status(500).message({ message: "Failed to save voter info" });
    return res
      .status(200)
      .json({ message: "Successfully registered voter", voter: result });
  }),

  get: TryCatch(async (req, res) => {
    const id = req.params.id;
    const filter = req.query;
    const match =
      filter.search !== undefined
        ? {
            $or: [
              { firstname: { $regex: filter.search, $options: "i" } },
              { lastname: { $regex: filter.search, $options: "i" } },
            ],
          }
        : {};

    const result = mongoose.isValidObjectId(id)
      ? await DataAccess.FindOne(Voter, { _id: id })
      : await Voter.find(match).sort({ createdAt: -1 });
    if (!result)
      return res.status(500).json({ mesage: "Something wentx wrong" });
    return res.status(200).json(result);
  }),
  put: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid object Id" });

    const result = await User.updateOne({ _id: id }, data);
    if (!result)
      return res.status(500).json({ message: "Failed to update voter" });
    return res
      .status(200)
      .json({ message: "Successfully updated voter's information" });
  }),
  remove: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid object Id" });

    const result = await DataAccess.DeleteOne(Voter, id);
    if (!result)
      return res.status(500).json({ message: "Failed to remove voter" });
    return res
      .status(200)
      .json({ message: "Successfully delete voter's information" });
  }),
};
