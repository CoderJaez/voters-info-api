const Session = require("./session.model");
const Instructor = require("../instructor/instructor.model");
const DataAccess = require("../DataAccess");
const mongoose = require("mongoose");

const { verifyJWT, signJWT } = require("../utils/jwt.util");
const SessionService = {
  IssueNewAccessToken: async (refreshToken) => {
    try {
      const { decoded } = await verifyJWT(refreshToken, "REFRESH_KEY");
      if (!decoded) return false;

      const session = await DataAccess.FindOne(Session, {
        _id: decoded.sessionId,
      });
      if (!session) return false;

      const user = await DataAccess.FindOne(Instructor, { _id: session.user });

      if (!user) return false;
      const data = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        image: user.image,
        role: user.role,
      };
      const newAccessToken = await signJWT(data, "ACCESS_KEY", {
        expiresIn: "15m",
      });
      return newAccessToken;
    } catch (error) {
      console.log("JWT: ", error);
    }
  },
  CreateOne: async (userId) => {
    return await DataAccess.CreateOne(Session, { user: userId });
  },

  DeleteOne: async (sessionId) => {
    return await DataAccess.DeleteOne(Session, sessionId);
  },
};

module.exports = SessionService;
