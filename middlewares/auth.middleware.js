import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/users.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const validatedData = jwt.verify(token, config.SECRET_KEY);
      const user = await User.findOne({ _id: validatedData.id });

      req.user = user;

      next();
    }
  } catch (error) {
    console.log(error);
  }
};

export const authorize =
  (...roles) =>
  async (req, res, next) => {
    try {
      console.log(req.user.role);

      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res.status(400).json({
          status: false,
          message: "you are not an authorized user to access thie resource",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
