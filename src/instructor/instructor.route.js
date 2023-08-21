const { Router } = require("express");
const {
  get,
  post,
  put,
  changePassword,
  remove,
} = require("./instructor.controller");
const router = Router();

router
  .get("/", get)
  .get("/:id", get)
  .post("/", post)
  .put("/:id", put)
  .put("/change-password/:id", changePassword)
  .delete("/:id", remove);

module.exports = router;
