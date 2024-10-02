const AsyncError = require("../Utils/AsyncError");
const CustomError = require("../Utils/CustomError");
const Vendor = require("./../Model/Vendor");
const { sendResponce } = require("./vendorController");

// change vendor password
const VendorPasswordChange = AsyncError(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  if (!currentPassword || !password || !confirmPassword) {
    let err = new CustomError(
      "Enter and currentPassword  password and confirmPassword ",
      403
    );
    return next(err);
  }
  const vendorData = await Vendor.findById(req.vendor._id).select("+password");
  const isPasswordMatch = await vendorData.isPasswordMatch(
    currentPassword,
    vendorData.password
  );
  if (!isPasswordMatch) {
    let err = new CustomError("Invalid Password!", 403);
    return next(err);
  }
  if (password !== confirmPassword) {
    let err = new CustomError(
      "Password and confirmPassword is not match!",
      403
    );
    return next(err);
  }
  vendorData.password = password;
  vendorData.confirmPassword = confirmPassword;
  vendorData.passwordChangedAt = Date.now();
  await vendorData.save({ validateBeforeSave: false });
  sendResponce(vendorData, res, 200, "update Vendor pasword successfully...");
});

// vendor details update
const updateVendor = AsyncError(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    let err = new CustomError("password not change this end point!", 403);
    return next(err);
  }
  function filterVendorData(obj, ...arr) {
    const newObj = {};
    Object.keys(obj).forEach((item) => {
      if (arr.includes(item)) {
        newObj[item] = obj[item];
      }
    });
    return newObj;
  }
  const updateVendorData = filterVendorData(req.body, "name", "email");
  const vendorData = await Vendor.findByIdAndUpdate(
    req.vendor._id,
    updateVendorData,
    { new: true, runValidators: true }
  );
  sendResponce(vendorData, res, 200, "update Vendor pasword successfully...");
});

// delete vendor
const deleteVendor = AsyncError(async (req, res, next) => {
  const vendorData = await Vendor.findByIdAndUpdate(
    req.vendor._id,
    { active: false },
    { new: true, runValidators: true }
  );
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// get all vendor
const getAllVendors = AsyncError(async (req, res, next) => {
  const vendorData = await Vendor.find().populate("firm").select("-__v");
  res.status(200).json({
    status: "success",
    length: vendorData.length,
    data: vendorData,
  });
});

// get vendort
const getVendors = AsyncError(async (req, res, next) => {
  const vendorData = await Vendor.findById(req.params.id)
    .populate("firm")
    .select("-__v");
  if (!vendorData) {
    let err = new CustomError("vendor data not found!", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    length: vendorData.length,
    data: vendorData,
  });
});
module.exports = {
  VendorPasswordChange,
  updateVendor,
  deleteVendor,
  getAllVendors,
  getVendors,
};
