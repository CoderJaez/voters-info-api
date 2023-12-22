const { Router } = require("express");
const { insertData, getData } = require("./datastream.controller");
const router = Router();

router.get("/insert-data", insertData).get("/", getData);

module.exports = router;
