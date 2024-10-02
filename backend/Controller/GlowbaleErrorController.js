const CustomError = require("../Utils/CustomError");

function devErr(res, err) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
    err,
  });
}
function proErr(res, err) {
  if (err.isOptional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "something went worng try letter!",
    });
  }
}

// ValidationErrorHandeler
function ValidationErrorHandeler(err) {
  let message = Object.values(err.errors).map((item) => item.message);
  message = message.join(". ");
  return new CustomError(message, 400);
}

// duplicateKeyErrorHandeler
function duplicateKeyErrorHandeler(err) {
  let message = `${Object.keys(err.keyValue)} : ${Object.values(
    err.keyValue
  )} is alredy exesit!`;
  return new CustomError(message, 401);
}

// JsonWebTokenErrorHandeler

function JsonWebTokenErrorHandeler(err) {
  let message = "invalid JWT Token";
  return new CustomError(message, 401);
}

// TokenExpiredErrorHandeler

function TokenExpiredErrorHandeler(err) {
  let message = "jwt is expired login again!";
  return new CustomError(message, 401);
}

// CastErrorHandeler
function CastErrorHandeler(err) {
  let message = `invalid ${err.path} : ${err.value}`;
  return new CustomError(message, 400);
}
function GlowbaleErrorController(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    devErr(res, err);
  }
  if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") {
      err = ValidationErrorHandeler(err);
    }
    if (err.code === 11000) {
      err = duplicateKeyErrorHandeler(err);
    }
    if (err.name === "JsonWebTokenError") {
      err = JsonWebTokenErrorHandeler(err);
    }
    if (err.name === "TokenExpiredError") {
      err = TokenExpiredErrorHandeler(err);
    }
    if (err.name === "CastError") {
      err = CastErrorHandeler(err);
    }
    proErr(res, err);
  }
}

module.exports = GlowbaleErrorController;
