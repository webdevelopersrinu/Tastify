const express = require("express");
const protect = require("./../Middleware/protect");
const firmController = require("./../Controller/firmController");
const firmRoutes = express.Router();
firmRoutes.route("/add-firm").post(protect.protect, firmController.addFirm);
firmRoutes.route("/").get(firmController.getAllFirms);
firmRoutes.route("/delete-firm/:firmId").delete(firmController.deleteFirm);
firmRoutes.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

module.exports = firmRoutes;
