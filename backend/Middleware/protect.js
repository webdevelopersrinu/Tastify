const { model } = require("mongoose");
const AsyncError = require("../Utils/AsyncError");
const CustomError = require("../Utils/CustomError");
const vendor = require("./../Model/Vendor");
const JWT = require("jsonwebtoken");

const protect = AsyncError(async (req, res, next) => {
  let testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  token = token === "null" ? null : token;
  if (!token) {
    let err = new CustomError("Login to acssece the information!");
    return next(err);
  }
  let decodeToken = JWT.verify(token, process.env.SCRETE_STR);
  let vendorData = await vendor.findById(decodeToken.id);
  if (!vendorData) {
    let err = new CustomError("vendor is not exist !", 404);
    return next(err);
  }
  let changePasswordAfterJWT = await vendorData.isPasswordChange(
    decodeToken.iat
  );
  if (changePasswordAfterJWT) {
    let err = new CustomError(
      "password change after jwt generate so place login again!",
      401
    );
    return next(err);
  }
  req.vendor = vendorData;
  next();
});

module.exports = { protect };
