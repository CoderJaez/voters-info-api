const Instructor = require("../instructor/instructor.model");
const { FindOne } = require("../DataAccess");
const TryCatch = require("../utils/tryCatch");
const { signJWT, verifyJWT } = require("../utils/jwt.util");
const SessionService = require("../session/session.service");

module.exports = {
  refresh: TryCatch(async (req, res) => {
    const refreshToken = req.headers["x-refresh-token"];
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
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      imagePath: user.image.path,
      role: user.role,
    };
    const session = await SessionService.CreateOne(user._id);

    const acces_token = await signJWT(data, "ACCESS_KEY", { expiresIn: "1m" });
    const refresh_token = await signJWT(
      { ...data, sessionId: session._id },
      "REFRESH_KEY",
      {
        expiresIn: "31d",
      },
    );

    return res.status(200).json({
      message: "Login successfull",
      assess_token: acces_token,
      refresh_token: refresh_token,
    });
  }),
};
