const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cros = require("cors");
const GlowbaleErrorController = require("./Controller/GlowbaleErrorController");
const CustomError = require("./Utils/CustomError");
const vendorRoutes = require("./Routes/vendorRoutes");
const firmRoutes = require("./Routes/firmRoutes");
const productRoutes = require("./Routes/productRoutes");
const path = require("path");

const app = express();
app.use(cros());
app.use(helmet());
let limiting = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "we have recevied too many requests from this IP . please try after one hour.",
});
let loginLimiting = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: "you try to login 5 times so please try after one hour.",
});
app.use("/api", limiting);
app.use("/api/v1/vendor/login", loginLimiting);
app.use(express.json({ limit: "10kb" }));
app.use(sanitize());
app.use(xss());

// route creation
app.use("/uploads", express.static("./uploads"));
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/firm", firmRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/",(req,res)=>{
  res.status(200).send("welcome to TASTIFY")
})
app.all("*", (req, res, next) => {
  let message = `this page ${req.originalUrl} is not found!`;
  let err = new CustomError(message, 404);
  next(err);
});

app.use(GlowbaleErrorController);
module.exports = app;
