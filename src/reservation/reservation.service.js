const mongoose = require("mongoose");
const Reservation = require("./reservation.model");

module.exports = {
  FindAll: async (match) => {
    const result = await Reservation.aggregate([
      {
        $match: match,
      },
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
          roomNo: "$classroom.roomNo",
          dateFrom: 1,
          dateTo: 1,
          approve: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  },
};
