import express from "express";
import { authMiddleware, authorize } from "./../middlewares/auth.middleware.js";
import { addReview } from "../controllers/reviews.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello review");
});

router.post(
  "/:bootcampId/:courseId",
  authMiddleware,
  authorize("user", "admin", "publisher"),
  addReview
);

export default router;
