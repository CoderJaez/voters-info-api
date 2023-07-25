const bycrypt = require("bcrypt");
const DataAccess = require("../DataAccess");
const TryCatch = require("../utils/tryCatch");
const {
  CreateOne,
  UpdateOne,
  FindAll,
  FindOne,
  DeleteOne,
} = require("../DataAccess");

const Teacher = require("./teacher.model");
const saltRound = 10;

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    data["password"] = await bycrypt.hashSync(data.password, saltRound);
    const result = await CreateOne(Teacher, data);
    if (!result)
      return res.status(500).json({ message: "Error saving Teacher info" });

    return res.status(200).json({ message: "Teacher registered " });
  }),
  put: TryCatch(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const result = await UpdateOne(Teacher, id, data);

    if (!result)
      return res.status(500).json({ message: "Error updating Teacher info" });
    return res.status(200).json({ message: "Successfully updated" });
  }),
  get: TryCatch(async (req, res) => {
    const filter = req.query;

    const result = await FindAll(Teacher, filter);
    if (!result) res.status(500).json({ message: "Something went wrong" });
    return res.status(200).json(result);
  }),

  changePassword: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    data.password = await bycrypt.hashSync(data.password, saltRound);

    const result = await UpdateOne(Teacher, id, data);
    if (!result)
      return res.status(500).json({ message: "Update password failed" });

    return res.status(200).json({ message: "Password update successfully" });
  }),
};
