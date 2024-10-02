const express = require("express");
const vendorController = require("./../Controller/vendorController");
const { protect } = require("../Middleware/protect");
const vendorAuthController = require("./../Controller/vendorAuthController");
const vendorRoutes = express.Router();

vendorRoutes.route("/signup").post(vendorController.signUpVendor);
vendorRoutes.route("/login").post(vendorController.loginVendor);
vendorRoutes.route("/protect").post(protect);
vendorRoutes.route("/all-vendor").get(vendorAuthController.getAllVendors);
vendorRoutes.route("/get-vendor/:id").get(vendorAuthController.getVendors);

// auth section
vendorRoutes
  .route("/updatePassword")
  .patch(protect, vendorAuthController.VendorPasswordChange);
vendorRoutes
  .route("/updateVendor")
  .patch(protect, vendorAuthController.updateVendor);
vendorRoutes
  .route("/deleteVendor")
  .delete(protect, vendorAuthController.deleteVendor);
module.exports = vendorRoutes;
