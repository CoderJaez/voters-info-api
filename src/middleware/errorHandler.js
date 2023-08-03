require("dotenv/config");
const { ENV } = process.env;
const errorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    //validation error
    // const errMessages = [err.errors.split(",")];
    const validationErrors = [];
    for (const field in err.errors) {
      validationErrors.push({
        field: field,
        message: err.errors[field].message,
      });
      // validationErrors[field] = err.errors[field].message;
    }
    return res.status(400).json({ message: validationErrors });
  }

  if (err.name === "CastError") {
    return res.status(500).json(err.message);
  }
  if (ENV === "production")
    //default to 500 server error
    return res.status(500).json("Something went wrong.");
  console.log("Error type: ", err.message);
  if (err) return res.status(500).json({ message: err.message });
  next();
};

module.exports = errorHandler;
