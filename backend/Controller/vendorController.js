const AsyncError = require("../Utils/AsyncError");
const CustomError = require("../Utils/CustomError");
const Vendor = require("./../Model/Vendor");
const JWT = require("jsonwebtoken");

// send responce
const sendResponce = (user, res, statusCode, message) => {
  let token = JWT.sign({ id: user._id }, process.env.SCRETE_STR, {
    expiresIn: process.env.LOGIN_EXPIRE,
  });
  const options = {
    maxAge: process.env.LOGIN_EXPAIR,
    httpOnly: true,
  };
  res.cookie("jwt", token, options);

  user.password = undefined;
  user.active = undefined;
  user.passwordChangedAt = undefined;
  user.__v = undefined;
  res.status(statusCode).json({
    status: "success",
    message,
    token,
    user,
  });
};

const signUpVendor = AsyncError(async (req, res, next) => {
  function filterRequstData(obj, ...arr) {
    let newObj = {};
    Object.keys(obj).forEach((item) => {
      if (arr.includes(item)) {
        newObj[item] = obj[item];
      }
    });
    return newObj;
  }
  const vendorSignUpData = filterRequstData(
    req.body,
    "name",
    "email",
    "password",
    "confirmPassword"
  );
  let vendorData = await Vendor.create(vendorSignUpData);
  sendResponce(vendorData, res, 200, "vendor signUp successfully...");
});

const loginVendor = AsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let err = new CustomError("Enter email and Password", 403);
    return next(err);
  }
  let vendorData = await Vendor.findOne({ email }).select("+password");
  if (!vendorData) {
    let err = new CustomError("Invalid email address!", 403);
    return next(err);
  }
  let isMatch = await vendorData.isPasswordMatch(password, vendorData.password);
  if (!isMatch) {
    let err = new CustomError("Invalid Password", 403);
    return next(err);
  }
  sendResponce(vendorData, res, 200, "login Vendor successfully...");
});
module.exports = { signUpVendor, loginVendor, sendResponce };
