const { verifyJWT } = require("../utils/jwt.util");
const { IssueNewAccessToken } = require("../session/session.service");
const authenticate = async (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization;

    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.headers["x-access-token"];
    const refresh_token = req.headers["x-refresh-token"];
    const { decoded, expired } = await verifyJWT(token, "ACCESS_KEY");
    console.log("Access token: ", decoded);
    if (expired && refresh_token) {
      const newAccessToken = await IssueNewAccessToken(refresh_token);
      if (!newAccessToken)
        return res.status(401).json({ message: "Unauthorized" });

      res.setHeader("x-access-token", newAccessToken);
      console.log("New access token: ", req.headers["x-access-token"]);
    }
  } catch (err) {
    console.log("Unauthorized: ", err.message);
  }
  return next();
};

module.exports = authenticate;
