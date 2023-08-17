const { verifyJWT, signJWT } = require("../utils/jwt.util");
const { IssueNewAccessToken } = require("../session/session.service");
const authenticate = async (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization;

    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.headers["x-access-token"];
    // console.log("Token: ", token);
    const refresh_token = req.headers["x-refresh-token"];
    const { decoded, expired } = await verifyJWT(token, "ACCESS_KEY");
    if (expired && !decoded) {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    console.log("403 Forbidden: ", err.message);
  }
  return next();
};

module.exports = authenticate;
