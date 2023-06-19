import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello review");
});

export default router;
