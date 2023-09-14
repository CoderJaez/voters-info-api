const mongoose = require("mongoose");
const Reservation = require("./reservation.model");

module.exports = {
  FindAll: async (match, skip = 0, limit = 10) => {
    const result = await Reservation.aggregate([
      {
        $lookup: {
          from: "classrooms",
          localField: "classroom",
          foreignField: "_id",
          as: "classroom",
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $unwind: "$classroom",
      },
      {
        $match: match,
      },
      {
        $project: {
          _id: 1,
          event: 1,
          instructor: {
            $concat: [
              "$instructor.firstname",
              " ",
              "$instructor.middlename",
              ".",
              " ",
              "$instructor.lastname",
            ],
          },
          classroom: "$classroom.roomNo",
          dateFrom: 1,
          dateTo: 1,
          approve: 1,
          createdAt: 1,
          updatedAt: 1,
          status: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return result;
  },
  FindOne: async (condition) => {
    const result = await Reservation.findOne(condition).populate("classroom");
    return result;
  },
};
