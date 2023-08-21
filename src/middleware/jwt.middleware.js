const { verifyJWT, signJWT } = require("../utils/jwt.util");
const { IssueNewAccessToken } = require("../session/session.service");
const authenticate = async (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization;

    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.headers["x-access-token"];
    // console.log("Access Token: ", token);
    const refreshToken = req.headers["x-refresh-token"];
    // console.log("Refresh token:", refreshToken);
    const { decoded, expired } = await verifyJWT(token, "ACCESS_KEY");
    if (expired && !decoded) {
      const decodeRefreshtoken = await verifyJWT(refreshToken, "REFRESH_KEY");
      // console.log(
      //   "Refresh Token:",
      //   refreshToken,
      //   "Decode:",
      //   decodeRefreshtoken,
      // );
      if (decodeRefreshtoken.expired && !decodeRefreshtoken.decoded)
        return res.status(403).json({ message: "Forbidden" });
      else {
        const newAccessToken = await signJWT(
          decodeRefreshtoken.decoded,
          "ACCESS_KEY",
        );
        // console.log("New access token: ", newAccessToken);
        res.header("x-access-token", newAccessToken);
        // console.log("Headers", res);
      }
    }
  } catch (err) {
    console.log("403 Forbidden: ", err.message);
  }
  return next();
};

module.exports = authenticate;
