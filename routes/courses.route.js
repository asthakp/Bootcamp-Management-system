import express from "express";
import { authMiddleware, authorize } from "./../middlewares/auth.middleware.js";
import {
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";
import { filteredResults } from "../middlewares/filteredResults.middleware.js";
import Course from "../models/courses.model.js";

const router = express.Router();

router.get("/", authMiddleware, filteredResults(Course), getCourse);

router.post(
  "/:bootcampId",
  authMiddleware,
  authorize("admin", "publisher"),
  addCourse
);

router.patch(
  "/:courseId",
  authMiddleware,
  authorize("admin", "publisher"),
  updateCourse
);

router.delete(
  "/:courseId",
  authMiddleware,
  authorize("admin", "publisher"),
  deleteCourse
);
export default router;
