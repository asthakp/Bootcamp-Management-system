import config from "../config/config.js";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      const user = new User(req.body);
      await user.save();
      res.status(200).json({
        status: true,
        data: user,
        message: "User created successfully",
      });
    } else {
      res.status(400).json({
        //400 means error caused by bad/invalid req
        status: false,
        message: "email is already registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const currUser = await User.findOne({ email });
  if (!currUser) {
    return res.status(400).json({
      status: false,
      message: "invalid email or password",
    });
  } else {
    const matchedPassword = await currUser.matchPassword(password);
    if (matchedPassword) {
      //generate token
      //save in db
      //return
      const token = jwt.sign({ id: currUser._id }, config.SECRET_KEY, {
        expiresIn: "1d",
      });
      // const decryptToken=jwt.verify(token, process.env.JWT_SECRET_KEY)
      const updatedUser = await User.findOneAndUpdate(
        { _id: currUser._id },
        { $set: { jwt: token } },
        { new: true }
      );

      res.status(200).json({
        status: true,
        data: updatedUser.jwt,
        message: "user logged in successfully",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "invalid email or password",
      });
    }
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "no user found",
      });
    }
    const resetToken = user.getResetToken();
    const message = "Your password reset token is " + resetToken;
    try {
      await sendEmail({
        email: user.email,
        subject: "password reset token",
        message,
      });
      //if no error, token and error saved in their respective values.
      await user.save({ validateBeforeSave: false });

      return res.status(201).json({
        status: true,
        message: "email sent successfully",
      });
    } catch (error) {
      console.log(error);
      //if error in db token and expire saved as undefined
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        status: true,
        message: "failed to send email",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { jwt: "" } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

//reset password is sth you do without logging in. it comes after forget password
export const resetPassword = async (req, res) => {
  try {
    const { resettoken } = req.params;
    //token send to user and stored in db are in different format. so need to hash to compare and match
    const resetPasswordToken = crypto
      .createHash("sha512")
      .update(resettoken)
      .digest("hex");

    //if token matches and token is not expired then find user
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid password token or password expired",
      });
    }
    const password = await hashedPass(req.body.password);
    console.log(password);
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password,
          resetPasswordToken: "",
          resetPasswordExpire: "",
        },
      },
      {
        new: true,
      }
    );
    if (updatedUser) {
      return res.status(200).json({
        status: true,
        data: updatedUser,
        message: "password changed successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const loggedInUser = (req, res) => {
  try {
    res.status(200).json({
      status: true,
      data: req.user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

//update password is sth you do after you are logged in and wish to change the password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const matchedPassword = await user.matchPassword(oldPassword);
    if (!matchedPassword) {
      return res.status(400).json({
        status: false,
        message: "invalid password",
      });
    }
    const password = await hashedPass(newPassword);
    const updatedPass = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { password } },
      { new: true }
    );
    res.status(200).json({
      status: true,
      data: updatedPass,
      message: "password updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "failed to update password",
    });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    const currUser = req.user;
    const updatedUser = await User.findOneAndUpdate(
      { _id: currUser._id },
      { $set: { name, email } },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      data: updatedUser,
      message: "User details updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

const hashedPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: true,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({
      status: true,
      data: user,
      message: "user created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name, email } },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      data: updatedUser,
      message: "user updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const delUser = await User.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({
      status: true,
      data: delUser,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error.message,
    });
  }
};
