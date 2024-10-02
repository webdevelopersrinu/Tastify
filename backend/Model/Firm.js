const mongoose = require("mongoose");
const product = require("./Product");

const firmSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: [true, "firmName is required!"],
    unique: true,
  },
  area: {
    type: String,
    required: [true, "area is required!"],
  },
  category: {
    type: String,
    enum: ["veg", "non-veg"],
    required: [true, "category is required!"],
  },
  region: {
    type: String,
    enum: ["south-india", "north-india", "chinese", "bakery"],
    required: [true, "region is required!"],
  },
  offer: {
    type: String,
  },
  image: {
    type: String,
  },
  vendor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
  ],
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Firm = mongoose.model("Firm", firmSchema);

module.exports = Firm;
