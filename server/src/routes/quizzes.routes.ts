import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getQuiz,
  getQuizzes,
} from "../controller/quizzes.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-quiz", authMiddleware, createQuiz);
router.get("/get-quizzes", authMiddleware, getQuizzes);
router.get("/get-quiz/:id", authMiddleware, getQuiz);
router.put("/edit-quiz/:id", authMiddleware, editQuiz);
router.delete("/delete-quiz/:id", authMiddleware, deleteQuiz);

export { router };
