const mongoose = require("mongoose");
const Classroom = require("./classroom.model");

const ClassroomService = {
  CreateOne: async (data) => {
    let classroom = new Classroom(data);
    classroom = await classroom.save();

    return classroom;
  },
  UpdateOne: async (id, data) => {
    if (!mongoose.isValidObjectId(id)) return null;

    const updateClassroom = Classroom.findByIdAndUpdate(id, data);
    return updateClassroom;
  },
  DeleteOne: async (id) => {
    if (!mongoose.isValidObjectId(id)) return null;
    const result = await Classroom.findByIdAndDelete(id);
    return result;
  },
  FindAll: async (search) => {
    const result = await Classroom.find(search);

    return result;
  },
  FindOne: async (id) => {
    const result = await Classroom.findOne({ _id: id });
    return result;
  },
};

module.exports = ClassroomService;
