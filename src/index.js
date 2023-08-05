const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
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
    exposedHeaders: "X-Total-Count",
  }),
);
app.use(express.json());

//Routers
const classroomRouter = require("./classrooom/classroom.route");
const instructorRouter = require("./instructor/instructor.route");
const occupancyRouter = require("./occupancy/occupancy.route");
//Routes
app.use(`${API_URL}classrooms`, classroomRouter);
app.use(`${API_URL}instructors`, instructorRouter);
app.use(`${API_URL}occupancies`, occupancyRouter);

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//Middlewares
app.use(errorHandler);

app.listen(PORT, connection, () => {
  console.log(`Server is running at port ${PORT}`);
});
