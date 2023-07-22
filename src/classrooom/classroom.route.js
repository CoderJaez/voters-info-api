const { Router } = require("express");
const { get, post, put, deleteOne } = require("./classroom.controller");
const router = Router();

router
  .get("/", get)
  .get("/:id", get)
  .post("/", post)
  .put("/:id", put)
  .delete("/:id", deleteOne);

module.exports = router;
