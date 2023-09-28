const bycrypt = require("bcrypt");
const TryCatch = require("../utils/tryCatch");
const mail = require("../utils/mail");
const generarateRandomPass = require("../utils/generateRandomPass");
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
    let data = req.body;
    data["password"] = generarateRandomPass(8);
    const result = await CreateOne(Instructor, data);
    const subject = "QRClassTrack App - Account Registration";
    const message = `
    Dear ${data.firstname} ${data.lastname},

    We are pleased to provide you with your default password for QRClassTrack. Please keep this information secure and consider changing your password after your initial login for added security.

    Your default password is: ${data.password}`;
    mail(data.email, subject, message);
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
    const match =
      req.query.search !== undefined
        ? {
            $or: [
              { lastname: { $regex: filter.search, $options: "i" } },
              { firstname: { $regex: filter.search, $options: "i" } },
              { role: { $regex: filter.search, $options: "i" } },
            ],
          }
        : {};
    const id = req.params.id;
    let result = mongoose.isValidObjectId(id)
      ? await FindOne(Instructor, { _id: id })
      : await FindAll(Instructor, match);

    if (!result) res.status(500).json({ message: "Instructor info not found" });
    return res.status(200).json(result);
  }),

  changePassword: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    data.password = await bycrypt.hashSync(data.password, saltRound);
  }),
};
