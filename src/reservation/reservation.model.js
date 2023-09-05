const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema(
  {
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "Instructor",
      required: [true, "{PATH} is required"],
    },
    classroom: {
      type: mongoose.Types.ObjectId,
      ref: "Classroom",
      required: [true, "{PATH} is required"],
    },
    dateFrom: {
      type: Date,
      required: [true, "Please select a date"],
    },

    dateTo: {
      type: Date,
      required: [true, "Please select a date"],
    },
    evenet: {
      type: String,
      required: [true, "{PATH} is required"],
    },
  },
  { timestamps: true },
);
