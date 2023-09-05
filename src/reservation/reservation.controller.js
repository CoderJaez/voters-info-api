const mongoose = require("mongoose");
const TryCatch = require("../utils/tryCatch");
const DataAccess = require("../DataAccess");
const Reservation = require("./reservation.model");
const { FindAll } = require("./reservation.service");

module.exports = {
  post: TryCatch(async (req, res) => {
    const data = req.body;
    let newResevation = new Reservation(data);

    newResevation = await newResevation.save();
    if (!newResevation)
      return res.status(500).json({ message: "Error saving reservation" });

    return res
      .status(200)
      .json({ message: "Successfully registered a reservation" });
  }),

  get: TryCatch(async (req, res) => {
    const { id } = req.params;
    const query = req.query;
    const result = await Reservation.find().sort({ createdAt: -1 });
    if (!result)
      return res.status(500).json({ message: "Something went wrong" });

    return res.status(200).json(result);
  }),
};
