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
    status: {
      type: String,
      default: "pending",
    },
    event: {
      type: String,
      required: [true, "{PATH} is required"],
    },
  },
  { timestamps: true },
);

reservationSchema.pre("validate", async function (next) {
  const dateFrom = this.dateFrom;
  const dateTo = this.dateTo;
  const classroom = this.classroom;

  const result = await this.constructor.findOne({
    classroom: classroom,
    $or: [
      {
        dateFrom: { $lte: dateFrom },
        dateTo: { $gte: dateFrom },
      },
      {
        dateFrom: { $lte: dateTo },
        dateTo: { $gte: dateTo },
      },
      {
        dateFrom: { $gte: dateFrom },
        dateTo: { $lte: dateTo },
      },
    ],
  });
  if (!result) return next();
  this.invalidate("reservation", "The reservation is not available");
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
