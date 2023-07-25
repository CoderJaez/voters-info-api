const { Router } = require("express");
const { get, post, put, changePassword } = require("./teacher.controller");
const router = Router();

router
  .get("/", get)
  .get("/:id", get)
  .post("/", post)
  .put("/:id", put)
  .put("/change-password/:id", changePassword);

module.exports = router;
