const TryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    // console.log("TryCatch:", error);
    return next(error);
  }
};

module.exports = TryCatch;
