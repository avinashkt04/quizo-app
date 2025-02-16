import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../controller/questions.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/:quizId/add-question", authMiddleware, createQuestion);
router.get("/:quizId/get-questions", authMiddleware, getQuestions);
router.put("/:quizId/edit-question/:id", authMiddleware, editQuestion);
router.delete("/:quizId/delete-question/:id", authMiddleware, deleteQuestion);

export { router };
