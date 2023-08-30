const { Router } = require("express");
const {
  login,
  refresh,
  logout,
  ResetPassword,
  ForgotPassword,
} = require("./auth.controller");
const router = Router();

router
  .post("/login", login)
  .post("/forgot-password", ForgotPassword)
  .get("/refresh", refresh)
  .post("/reset-password", ResetPassword)
  .get("/logout", logout);

module.exports = router;
