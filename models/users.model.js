import mongoose from "mongoose";
import { validationMessage } from "../constants/validationMessage.constants.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, validationMessage.REQUIRED_NAME_MESSAGE],
    },
    email: {
      type: String,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        validationMessage.EMAIL_VALIDATION_MESSAGE,
      ],
      unique: true,
      required: [true, validationMessage.REQUIRED_EMAIL_MESSAGE],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "publiser"],
    },
    password: {
      type: String,
      required: [true, "password is a required field"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      ],
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    passwordExpire: {
      type: Date,
    },
    jwt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex"); //send to user
  this.resetPasswordToken = crypto
    .createHash("sha512")
    .update(resetToken)
    .digest("hex"); //stored in db
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; //10 min in ms

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
