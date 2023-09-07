const { Router } = require("express");
const { get, post, getOne, put } = require("./reservation.controller");

const router = Router();
router.post("/", post).get("/", get).get("/:id", getOne).put("/:id", put);

module.exports = router;
