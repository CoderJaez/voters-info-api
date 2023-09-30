const mongoose = require("mongoose");

const DataAccess = {
  CreateOne: async (Model, data) => {
    let result = new Model(data);
    result = await result.save();

    return result;
  },
  UpdateOne: async (Model, id, data) => {
    if (!mongoose.isValidObjectId(id)) return null;

    const result = await Model.updateOne({ _id: id }, data);
    return result;
  },
  UpdateMany: async (Model, condition, value) => {
    const result = Model.updateMany(condition, value);
    return result;
  },
  DeleteOne: async (Model, id) => {
    if (!mongoose.isValidObjectId(id)) return null;
    const result = await Model.findByIdAndDelete(id);
    return result;
  },
  FindAll: async (Model, search) => {
    const result = await Model.find(search).sort({ createdAt: -1 });

    return result;
  },
  FindOne: async (Model, condition) => {
    const result = await Model.findOne(condition);
    if (!result) return null;
    return result;
  },
};

module.exports = DataAccess;
