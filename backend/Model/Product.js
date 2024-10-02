const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "enter product name"],
  },
  price: {
    type: Number,
    required: [true, "enter product price"],
  },
  category: {
    type: [
      {
        type: String,
        enum: ["veg", "non-veg"],
      },
    ],
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "enter product description"],
  },
  image: {
    type: String,
  },
  firm: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
    },
  ],
});

const product = mongoose.model("product", productSchema);

module.exports = product;
