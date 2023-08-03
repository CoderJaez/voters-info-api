const { Router } = require("express");
const { get, post } = require("./occupancy.controller");
const router = Router();

router.get("/", get).post("/", post);

module.exports = router;
