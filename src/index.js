const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authenticate = require("./middleware/jwt.middleware");
require("dotenv/config");
const { PORT, API_URL } = process.env;

const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Header",
      "Access-Control-Expose-Headers",
      "Content-Range",
      "Content-Length",
      "Connection",
      "Content-Type",
      "X-Content-Type-Options",
      "Set-Cookies",
      "*",
    ],
    exposedHeaders: ["X-Total-Count", "x-access-token", "x-refresh-token"],
  }),
);
app.use(express.json());

//Routers
const classroomRouter = require("./classrooom/classroom.route");
const instructorRouter = require("./instructor/instructor.route");
const occupancyRouter = require("./occupancy/occupancy.route");
const reservationRouter = require("./reservation/reservation.route");
const authRouter = require("./auth/auth.route");
const meRouter = require("./auth/me/me.route");

//Routes
app.use(`${API_URL}classrooms`, authenticate, classroomRouter);
app.use(`${API_URL}instructors`, authenticate, instructorRouter);
app.use(`${API_URL}occupancies`, authenticate, occupancyRouter);
app.use(`${API_URL}reservations`, reservationRouter);
app.use(`${API_URL}auth`, authRouter);
app.use(`${API_URL}me`, authenticate, meRouter);

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//Middlewares
app.use(errorHandler);
app.listen(PORT, connection, () => {
  console.log(`Server is running at port ${PORT}`);
});
