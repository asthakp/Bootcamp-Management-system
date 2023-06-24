import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  loggedInUser,
  updatePassword,
  updateDetails,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { authMiddleware, authorize } from "../middlewares/auth.middleware.js";
import { filteredResults } from "../middlewares/filteredResults.middleware.js";
import User from "../models/users.model.js";

const router = express.Router();
//swagger example available on https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: example@gmail.com
 *               password: User123#
 *     responses:
 *       201:
 *         ...
 */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, loggedInUser);
router.patch("/updatepassword", authMiddleware, updatePassword);
router.patch("/updatedetails", authMiddleware, updateDetails);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

router.get(
  "/read",
  authMiddleware,
  authorize("admin"),
  filteredResults(User),
  getUser
);

router.post("/create", authMiddleware, authorize("admin"), createUser);
router.patch("/update/:id", authMiddleware, authorize("admin"), updateUser);
router.delete("/delete/:id", authMiddleware, authorize("admin"), deleteUser);

export default router;
