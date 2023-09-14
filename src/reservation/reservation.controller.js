const mongoose = require("mongoose");
const TryCatch = require("../utils/tryCatch");
const DataAccess = require("../DataAccess");
const Reservation = require("./reservation.model");
const service = require("./reservation.service");
const { FindAll } = require("./reservation.service");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    let newResevation = new Reservation(data);

    newResevation = await newResevation.save();

    let newData = await service.FindOne({ _id: newResevation._id });
    newData = {
      _id: newData._id,
      event: newData.event,
      dateFrom: newData.dateFrom,
      date_to: newData.dateTo,
      instructor: newData.instructor.fullname,
      classroom: newData.classroom.roomNo,
      status: newData.status,
    };
    if (!newResevation)
      return res.status(500).json({ message: "Error saving reservation" });

    return res.status(200).json({
      message: "Successfully registered a reservation",
      newReservation: newData,
    });
  }),

  get: TryCatch(async (req, res) => {
    const id = req.params.id;
    const filter = req.query ? req.query : {};
    let match = {};
    const pageSize = filter.limit ? filter.limit : 20; // Number of documents per page
    const pageNumber = filter.page ? filter.page : 0; // Page number to retrieve
    const filterDate =
      filter.date_from && filter.date_to
        ? { $gte: new Date(filter.date_from), $lte: new Date(filter.date_to) }
        : null;

    if (filter.search !== undefined && filterDate) {
      match = {
        $or: [
          { "instructor.lastname": { $regex: filter.search, $options: "i" } },
          { "instructor.fistname": { $regex: filter.search, $options: "i" } },
          { "instructor._id": new mongoose.Types.ObjectId(filter.search) },
        ],
        dateFrom: filterDate,
      };
    } else if (filterDate) {
      match = {
        dateFrom: filterDate,
      };
    } else {
      match = {
        $or: [
          { "instructor.lastname": { $regex: filter.search, $options: "i" } },
          { "instructor.fistname": { $regex: filter.search, $options: "i" } },
          { "instructor._id": new mongoose.Types.ObjectId(filter.search) },
        ],
      };
    }
    const result = await service.FindAll(match);
    if (!result)
      return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json(result);
  }),

  getOne: TryCatch(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid Object Id" });

    const match = { _id: new mongoose.Types.ObjectId(id) };
    const result = await service.FindAll(match);
    if (!result)
      return res.status(500).json({ message: "Error retrieving data" });

    return res.status(200).json(result[0]);
  }),
  put: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    if (!mongoose.isValidObjectId(id))
      return res.status(500).json({ message: "Invalid Object Id" });
    const result = await Reservation.updateOne({ _id: id }, data);
    console.log(result);
    if (!result)
      return res.status(500).json({ message: "Error updating data" });

    return res
      .status(200)
      .json({ message: "Successfullu updated reservation" });
  }),
};
