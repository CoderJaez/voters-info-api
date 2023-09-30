const { Router } = require("express");
const { get, post, put, remove } = require("./voter.controller");
const router = Router();

router
  .get("/", get)
  .post("/", post)
  .get("/:id", get)
  .put("/:id", put)
  .delete("/:id", remove);

module.exports = router;
