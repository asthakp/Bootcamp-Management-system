import express from "express";
import "dotenv/config";
import indexRouter from "./routes/index.js";
import config from "./config/config.js";
import { dbConnection } from "./config/db.config.js";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";

const app = express();
dbConnection();
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use("/api/v1", indexRouter);

//error handling for unmatched routes
app.use((req, res, next) => {
  const error = new Error("page not found");
  error.status = 404;
  next(error);
});

//error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    status: false,
    error: error.message,
  });
});

app.listen(config.PORT, () => {
  console.log(
    `server is running in ${config.NODE_ENV} environment at port ${config.PORT}`
  );
});
