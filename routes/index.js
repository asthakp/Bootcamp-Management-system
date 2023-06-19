import express from "express";
import bootcampRouter from "./bootcamp.route.js";
import userRouter from "./users.route.js";
import courseRouter from "./courses.route.js";
import reviewRouter from "./reviews.route.js";
const router = express.Router();

router.use("/bootcamp", bootcampRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);
router.use("/review", reviewRouter);

export default router;
