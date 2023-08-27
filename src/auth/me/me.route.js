const { Router } = require("express");
const { uploadImage, UpdateUser, ChangePassword } = require("./me.controller");
const router = Router();

router
  .put("/:id", UpdateUser)
  .post("/upload-image/:id", uploadImage)
  .put("/change-password/:id", ChangePassword);

module.exports = router;
