process.on("uncaughtException", function (err) {
  console.log("Error Message:-" + err.message);
  console.log("Error Name:-" + err.name);
  console.log("Error Stack:- \n" + err.stack);
  console.log("unhandled Exception server setting Down!");
  process.exit(1);
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const PORT = process.env.PORT || 6500;
// server connection
let server = app.listen(PORT, () => {
  console.log("server start runing...");
});
// db connection
mongoose
  .connect(process.env.DB_CON)
  .then(() => console.log("db connection is successful..."))
  .catch(() =>
    console.log("db connection is not successful some error occured...")
  );

process.on("unhandledRejection", function (err) {
  console.log("Error Message:-" + err.message);
  console.log("Error Name:-" + err.name);
  console.log("Error Stack:- \n" + err.stack);
  console.log("unhandled Rejection server setting Down!");
  server.close(() => {
    process.exit(1);
  });
});
