const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
require("dotenv/config");
const { PORT, API_URL } = process.env;

const app = express();

app.use(cors("*"));
app.use(express.json());

//Routes
const classroomRouter = require("./classrooom/classroom.route");
const teacherRouter = require("./teacher/teacher.route");
//Routers
app.use(`${API_URL}classrooms`, classroomRouter);
app.use(`${API_URL}teachers`, teacherRouter);
//Middlewares
app.use(errorHandler);

app.listen(PORT, connection, () => {
  console.log(`Server is running at port ${PORT}`);
});
