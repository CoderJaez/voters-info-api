const { Router } = require("express");
const { get, post } = require("./occupancy.controller");
const router = Router();

router.get("/", get).get("/:id", get).post("/", post);

module.exports = router;
