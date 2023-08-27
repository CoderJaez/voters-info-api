const { Router } = require("express");
const { get, post, put, remove } = require("./instructor.controller");
const router = Router();

router
  .get("/", get)
  .get("/:id", get)
  .post("/", post)
  .put("/:id", put)
  .delete("/:id", remove);

module.exports = router;
