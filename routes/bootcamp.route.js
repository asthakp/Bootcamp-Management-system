import express from "express";
import {
  addBootcamp,
  deleteBootcamp,
  getBootcamp,
  updateBootcamp,
} from "../controllers/bootcamp.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware, authorize } from "./../middlewares/auth.middleware.js";
import { filteredResults } from "../middlewares/filteredResults.middleware.js";
import Bootcamp from "../models/bootcamp.model.js";

const router = express.Router();

router.get("/", authMiddleware, filteredResults(Bootcamp), getBootcamp);

router.post(
  "/",
  authMiddleware,
  authorize("admin", "publisher"),
  upload.single("photo"),
  addBootcamp
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("admin", "publisher"),
  upload.single("photo"),
  updateBootcamp
);

router.delete(
  "/:bootcampId",
  authMiddleware,
  authorize("admin", "publisher"),
  deleteBootcamp
);

export default router;
