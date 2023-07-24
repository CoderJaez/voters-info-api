const DataAccess = require("../DataAccess");
const TryCatch = require("../utils/tryCatch");
const Teacher = require("./teacher.model");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    const result = DataAccess.CreateOne(Teacher, data);
    if (!result)
      return res.status(500).json({ message: "Error saving Teacher info" });

    return res.status(200).json({ message: "Teacher registered " });
  }),
  put: TryCatch(async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const result = DataAccess.UpdateOne(Teacher, id, data);

    if (!result)
      return res.status(500).json({ message: "Error updating Teacher info" });
    return res.status(200).json({ message: "Successfully updated" });
  }),
};
