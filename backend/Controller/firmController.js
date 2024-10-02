const multer = require("multer");
const Firm = require("./../Model/Firm");
const Vendor = require("./../Model/Vendor");
const AsyncError = require("../Utils/AsyncError");
const CustomError = require("../Utils/CustomError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const addFirm = AsyncError(async (req, res, next) => {
  const { firmName, area, category, region, offer } = req.body;
  const image = req.file ? req.file.filename : undefined;
  const vendorData = await Vendor.findById(req.vendor._id);

  const firmData = new Firm({
    firmName,
    area,
    category,
    region,
    offer,
    image,
    vendor: vendorData._id,
  });
  const saveFirm = await firmData.save();
  vendorData.firm.push(saveFirm);
  await vendorData.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "firm add succesfully.",
  });
});

const getAllFirms = AsyncError(async (req, res, next) => {
  let firmData = await Firm.find();
  if (!firmData) {
    let err = new CustomError("not have any firms!", 404);
    return next(err);
  }
  res.status(200).json({
    message: "success",
    length: firmData.length,
    firmData,
  });
});
// delete firm
const deleteFirm = AsyncError(async (req, res, next) => {
  let deleteFirm = await Firm.findByIdAndDelete(req.params.firmId);
  if (!deleteFirm) {
    let err = new CustomError("firm is not found!", 404);
    return next(err);
  }
  res.status(204).json({
    message: "succces",
    data: null,
  });
});

module.exports = {
  addFirm: [upload.single("image"), addFirm],
  getAllFirms,
  deleteFirm,
};
