const { Router } = require("express");
const { get, post, put } = require("./occupancy.controller");
const router = Router();

router.get("/", get).get("/:id", get).post("/", post).put("/:id", put);

module.exports = router;
