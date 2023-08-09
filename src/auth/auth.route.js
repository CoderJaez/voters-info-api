const { Router } = require("express");
const { login, refresh, logout } = require("./auth.controller");
const router = Router();

router.post("/login", login).get("/refresh", refresh).get("/logout", logout);

module.exports = router;
