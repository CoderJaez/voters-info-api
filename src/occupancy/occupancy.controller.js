const Occupancy = require("./occupancy.model");
const TryCatch = require("../utils/tryCatch");
const DataAccess = require("../DataAccess");
const OccupancyService = require("./occupancy.service");
const { default: mongoose } = require("mongoose");
const Classroom = require("../classrooom/classroom.model");
module.exports = {
  get: TryCatch(async (req, res) => {
    const id = req.params.id;
    const filter = req.query;
    const filterDate =
      filter.date_from && filter.date_to
        ? { $gte: new Date(filter.date_from), $lte: new Date(filter.date_to) }
        : null;
    let match;
    if (id) {
      match = {
        instructor: new mongoose.Types.ObjectId(id),
        isVacant: JSON.parse(filter.isVacant),
      };
    } else if (filter.name && filter.room && filterDate) {
      match = {
        "instructor.name": { $regex: filter.name, $options: "i" },
        "classroom.roomNo": { $regex: filter.room, $options: "i" },
        createAt: filterDate,
      };
    } else {
      match = {
        "instructor.name": {
          $regex: filter.name ? filter.name : "",
          $options: "i",
        },
        "classroom.roomNo": {
          $regex: filter.room ? filter.room : "",
          $options: "i",
        },
      };
    }

    const result = await OccupancyService.FindAll(match);
    // console.log("Result:", result);
    if (!result)
      return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json(result);
  }),

  post: TryCatch(async (req, res) => {
    const data = req.body;
    const result = await OccupancyService.CreateOccupancy(data);
    if (!result)
      return res.status(500).json({ message: "Error saving occupancy" });
    return res.status(200).json({ message: "Successfully occupied classroom" });
  }),
  put: TryCatch(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid object Id." });
    const occupancy = await Occupancy.findOne({ _id: id });
    const result = await Occupancy.updateOne({ _id: id }, { isVacant: true });
    const classroomResult = await Classroom.updateOne(
      { _id: occupancy.classroom },
      { isOccupied: false },
    );
    console.log(result, classroomResult);
    if (!result || !classroomResult)
      return res.status(500).json({ message: "Error in vacating room " });

    return res.status(200).json({ message: "The room is now available." });
  }),
};
