const TryCatch = require("../../utils/tryCatch");
const { Datastream } = require("./datastream.model");
const mongoose = require("mongoose");

module.exports = {
  insertData: TryCatch(async (req, res) => {
    const { lat, lng } = req.query;
    let data = new Datastream({
      latitude: lat,
      longitude: lng,
    });

    data = await data.save();
    if (!data) return res.status(500).json("Error");
    return res.status(201).json("ok");
  }),
  getData: TryCatch(async (req, res) => {
    const data = await Datastream.find().limit(1).sort({ createdAt: -1 });
    return res.status(200).json(data);
  }),
};
