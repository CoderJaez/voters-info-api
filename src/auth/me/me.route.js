const { Router } = require("express");
const { uploadImage, UpdateUser } = require("./me.controller");
const router = Router();

router.put("/:id", UpdateUser).post("/upload-image/:id", uploadImage);

module.exports = router;
