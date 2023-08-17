const Instructor = require("../instructor/instructor.model");
const { FindOne } = require("../DataAccess");
const TryCatch = require("../utils/tryCatch");
const { signJWT, verifyJWT } = require("../utils/jwt.util");
const {
  IssueNewAccessToken,
  CreateOne,
  DeleteOne,
} = require("../session/session.service");

module.exports = {
  refresh: TryCatch(async (req, res) => {
    const refreshToken = req.headers["x-refresh-token"];

    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    const newAccessToken = await IssueNewAccessToken(refreshToken);

    if (!newAccessToken)
      return res.status(403).json({ message: "Forbidden accesss" });

    return res.status(200).json({ accessToken: newAccessToken });
  }),
  login: TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await FindOne(Instructor, { email: email });
    if (!user)
      return res.status(400).json({ message: "Invalid email/password." });

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid email/password." });

    const data = {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      imagePath: user.image.path,
      contact_no: user.contact_no,
      role: user.role,
    };
    // const session = await CreateOne(user._id);

    const acces_token = await signJWT(data, "ACCESS_KEY", { expiresIn: "15m" });
    const refresh_token = await signJWT({ ...data }, "REFRESH_KEY", {
      expiresIn: "31d",
    });
    return res.status(200).json({
      message: "Login successfull",
      user: data,
      access_token: acces_token,
      refresh_token: refresh_token,
    });
  }),
  logout: TryCatch(async (req, res) => {
    const refresh_token = req.headers["x-refresh-token"];
    const { decoded } = await verifyJWT(refresh_token, "REFRESH_KEY");
    if (!decoded) return res.status(403).json({ message: "Forbidden" });
    const result = await DeleteOne(decoded.sessionId);
    if (!result)
      return res.status(500).json({ message: "Error removing session" });

    return res.status(202).json({ message: "Successfully logout" });
  }),
};
