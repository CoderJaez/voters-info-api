const { verifyJWT } = require("../utils/jwt.util");
const { IssueNewAccessToken } = require("../session/session.service");
const authenticate = async (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization;

    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.headers["x-access-token"];
    // const refresh_token = req.headers["x-refresh-token"];
    const { decoded, expired, valid } = await verifyJWT(token, "ACCESS_KEY");
    if (expired && !decoded)
      return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    console.log("401 Unauthorized: ", err.message);
  }
  return next();
};

module.exports = authenticate;
