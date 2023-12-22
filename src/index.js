const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authenticate = require("./middleware/jwt.middleware");

require("dotenv/config");
const { PORT, API_URL } = require("./constants");

const app = express();

app.use(
  cors({
    origin: "*",
    supports_credentials: true,
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
const authRouter = require("./modules/auth/auth.route");
const meRouter = require("./modules/auth/me/me.route");
const voterRouter = require("./modules/voter/voter.route");
const datastreamRouter = require("./modules/datastream/datastream.route");
//Routes
app.use(`${API_URL}auth`, authRouter);
app.use(`${API_URL}me`, authenticate, meRouter);
app.use(`${API_URL}voters`, voterRouter);
app.use(`${API_URL}datastreams`, datastreamRouter);
// app.use("*", (err, req, res, next) => {
//   err.status = err.status || "error";
//   err.statusCode = err.statusCode || 500;
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//Middlewares
app.use(errorHandler);
app.listen(PORT, connection, () => {
  console.log(`Server is running at port ${PORT}`);
});
