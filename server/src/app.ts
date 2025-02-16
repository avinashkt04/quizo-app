import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routes/users.routes";
import { router as quizRouter } from "./routes/quizzes.routes";
import { router as questionRouter } from "./routes/questions.routes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/quizzes", quizRouter);
app.use("/api/v1/", questionRouter);

export { app };
