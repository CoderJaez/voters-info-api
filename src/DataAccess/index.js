const mongoose = require("mongoose");

const DataAccess = {
  CreateOne: async (Model, data) => {
    let result = new Model(data);
    result = await result.save();

    return result;
  },
  UpdateOne: async (Model, id, data) => {
    if (!mongoose.isValidObjectId(id)) return null;

    const result = Model.findByIdAndUpdate(id, data);
    return result;
  },
  DeleteOne: async (Model, id) => {
    if (!mongoose.isValidObjectId(id)) return null;
    const result = await Model.findByIdAndDelete(id);
    return result;
  },
  FindAll: async (Model, search) => {
    const result = await Model.find(search);

    return result;
  },
  FindOne: async (Model, id) => {
    const result = await Model.findOne({ _id: id });
    return result;
  },
};

module.exports = DataAccess;
