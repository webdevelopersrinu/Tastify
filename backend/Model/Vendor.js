const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required!"],
  },
  email: {
    type: String,
    required: [true, "email is required!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "enter valide email"],
  },
  password: {
    type: String,
    required: [true, "password is required!"],
    validate: [validator.isStrongPassword, "enter strong password!"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm password is required!"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "password and cofirm password is not match!",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordChangedToken: {
    type: String,
    select: false,
  },
  passwordChangedTokenExpaire: {
    type: Date,
    select: false,
  },
  firm: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
    },
  ],
});

// password encypting
vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// compaire password method
vendorSchema.methods.isPasswordMatch = async function (password, dbPassword) {
  let result = await bcryptjs.compare(password, dbPassword);
  return result;
};

// check password Changed after jwt generate
vendorSchema.methods.isPasswordChange = async function (jwtTimeStamp) {
  if (!this.passwordChangedAt) {
    return false;
  }
  let passwordChangedTimeStamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return passwordChangedTimeStamp > jwtTimeStamp;
};
// restricte delete accountes
vendorSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// create model
const Vendor = mongoose.model("vendor", vendorSchema);

module.exports = Vendor;
