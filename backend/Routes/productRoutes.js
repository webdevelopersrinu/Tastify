const express = require("express");
const productController = require("./../Controller/productController");

const productRoutes = express.Router();
productRoutes.route("/add-product/:firmId").post(productController.addProduct);
productRoutes.route("/get-product/:firmId").get(productController.getProducts);
productRoutes
  .route("/delete-product/:producteId")
  .get(productController.deleteProducte);

productRoutes.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});
module.exports = productRoutes;
