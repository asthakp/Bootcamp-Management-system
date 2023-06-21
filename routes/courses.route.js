import express from "express";
import { authMiddleware, authorize } from "./../middlewares/auth.middleware.js";
import { addCourse } from "../controllers/courses.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello course");
});

router.post(
  "/:bootcampId",
  authMiddleware,
  authorize("admin", "publisher"),
  addCourse
);

export default router;
