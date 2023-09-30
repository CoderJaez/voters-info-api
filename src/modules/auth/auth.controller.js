const User = require("../user/user.model");
const { FindOne, UpdateOne } = require("../../DataAccess");
const TryCatch = require("../../utils/tryCatch");
const { signJWT, verifyJWT } = require("../../utils/jwt.util");
const sendMail = require("../../utils/mail");
const bcrypt = require("bcrypt");

function generateRandom6DigitPin() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  refresh: TryCatch(async (req, res) => {
    const refreshToken = req.headers["x-refresh-token"];
    console.log("Refresh token:", refreshToken);
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    const newAccessToken = await IssueNewAccessToken(refreshToken);

    if (!newAccessToken)
      return res.status(403).json({ message: "Forbidden accesss" });

    return res.status(200).json({ accessToken: newAccessToken });
  }),
  login: TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await FindOne(User, { email: email });
    if (!user)
      return res.status(400).json({ message: "Invalid email/password." });

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid email/password." });

    const data = {
      id: user._id,
      email: user.email,
      middlename: user.middlename,
      firstname: user.firstname,
      lastname: user.lastname,
      image_path: user.image.path,
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
  ResetPassword: TryCatch(async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const hashPassword = await bcrypt.hashSync(password, 12);
    const result = await User.updateOne({ email }, { password: hashPassword });
    if (!result)
      return res.status(500).json({ message: "Error resetting password" });

    return res
      .status(200)
      .json({ message: "Successfully resetting password." });
  }),
  ForgotPassword: TryCatch(async (req, res) => {
    const data = req.body;

    const result = await FindOne(User, data);
    if (!result) return res.status(400).json({ message: "Username not found" });
    const userName = result.fullname();
    const randomPin = generateRandom6DigitPin();

    const subject = "QRClassTrack App Password Reset";
    const content = `
    Dear ${userName}, \n
    We recently received a request to reset the password for your QRClassTrack app account. 
    If you didn't initiate this request, please disregard this message.\n
    If you did request a password reset, please use the following temporary verification code to reset your password:
    Temporary Verification Code: ${randomPin}`;
    sendMail(data.email, subject, content);
    return res.status(200).json({
      message: "Sending Email",
      pin: randomPin,
    });
  }),
};
