const { Router } = require("express");
const {
  get,
  post,
  put,
  changePassword,
  uploadImage,
  remove,
} = require("./teacher.controller");
const router = Router();

router
  .get("/", get)
  .get("/:id", get)
  .post("/", post)
  .post("/upload-image/:id", uploadImage)
  .put("/:id", put)
  .put("/change-password/:id", changePassword)
  .delete("/:id", remove);

module.exports = router;
