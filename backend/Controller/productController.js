const AsyncError = require("../Utils/AsyncError");
const Product = require("./../Model/Product");
const Firm = require("./../Model/Firm");
const multer = require("multer");
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
const addProduct = AsyncError(async (req, res, next) => {
  const { productName, price, category, bestSeller, description } = req.body;
  const image = req.file ? req.file.filename : undefined;
  const firmId = req.params.firmId;
  const firm = await Firm.findById(firmId);
  if (!firm) {
    let err = new CustomError("firm is not found!", 404);
    return next(err);
  }
  const product = new Product({
    productName,
    price,
    category,
    bestSeller,
    description,
    image,
    firm: firm._id,
  });
  const newProduct = await product.save();
  firm.product.push(newProduct);
  await firm.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "product add successfully!",
    product: newProduct,
  });
});

// get productes

const getProducts = AsyncError(async (req, res, err) => {
  const firmId = req.params.firmId;
  const firm = await Firm.findById(firmId);
  if (!firm) {
    let err = new CustomError("firm is not found!", 404);
    return next(err);
  }
  const restorentName = firm.firmName;
  const products = await Product.find({ firm: firmId });
  if (!products) {
    let err = new CustomError("products is not found!", 404);
    return next(err);
  }
  res.status(200).json({
    message: "success",
    length: products.length,
    restorentName,
    products,
  });
});

const deleteProducte = AsyncError(async (req, res, next) => {
  const deleteProducte = await Product.findByIdAndDelete(req.params.producteId);
  if (!deleteProducte) {
    let err = new CustomError("producte is not found!");
    return next(err);
  }
  res.status(204).json({
    message: "success",
    data: null,
  });
});

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProducts,
  deleteProducte,
};
