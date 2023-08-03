const Occupancy = require("./occupancy.model");
const Classroom = require("../classrooom/classroom.model");
const DataAccess = require("../DataAccess");
const OccupancyService = {
  FindAll: async (match) => {
    const result = await Occupancy.aggregate([
      {
        $lookup: {
          from: "intructors",
          localField: "intructor",
          foreignField: "_id",
          as: "instructor",
        },
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
        $unwind: "$instructor",
      },
      {
        $unwind: "$classroom",
      },
      {
        $project: {
          _id: 1,
          instructor: {
            $concat: ["$instructor.firstname", " ", "$instructor.lastname"],
          },
          classroom: {
            roomNo: "$classroom.roomNo",
            occupied: "$classroom.isOccupied",
          },
          isVacant: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return result;
  },
  CreateOccupancy: async (data) => {
    const resultOccupancy = await DataAccess.CreateOne(Occupancy, data);
    if (resultOccupancy) {
      const roomOccupied = await DataAccess.UpdateOne(
        Classroom,
        data.classroom,
        { isOccupied: true },
      );
      if (roomOccupied) return resultOccupancy;
    }
    return null;
  },
};

module.exports = OccupancyService;
