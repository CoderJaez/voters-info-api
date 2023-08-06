const jwt = require("jsonwebtoken");
require("dotenv/config");

const { ACCESS_PUBLIC_KEY, REFRESH_PUBLIC_KEY } = process.env;

const signJWT = async (object, keyName, options) => {
  const key = keyName === "ACCESS_KEY" ? ACCESS_PUBLIC_KEY : REFRESH_PUBLIC_KEY;
  const token = await jwt.sign(object, key, options);
  return token;
};

const verifyJWT = async (token, keyName) => {
  const key = keyName === "ACCESS_KEY" ? ACCESS_PUBLIC_KEY : REFRESH_PUBLIC_KEY;

  try {
    const decoded = await jwt.verify(token, key);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    // console.log(error);
    return {
      valid: false,
      expired: true,
      decoded: null,
    };
  }
};

module.exports = { signJWT, verifyJWT };
