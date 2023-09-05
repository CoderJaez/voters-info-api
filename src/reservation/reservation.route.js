const { Router } = require("express");
const { get, post } = require("./reservation.controller");

const router = Router();
router.post("/", post).get("/", get).get("/:id", get);

module.exports = router;
