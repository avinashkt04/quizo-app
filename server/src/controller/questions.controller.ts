import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { CreateQuestionRequest } from "../utils/types";

const prisma = new PrismaClient();

const createQuestion = async (
  req: CreateQuestionRequest,
  res: Response
): Promise<void> => {
  const { question, options, answer } = req.body;
  const { quizId } = req.params;

  if (!question || !Array.isArray(options) || !answer) {
    res
      .status(400)
      .json({ error: "Questions, options and answers are required" });
    return;
  }

  try {
    console.log(quizId);
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    const newQuestion = await prisma.question.create({
      data: {
        question,
        options: {
          set: options,
        },
        answer,
        quizId,
      },
      select: { question: true, options: true, answer: true },
    });

    res
      .status(201)
      .json({ message: "Question created successfully", data: newQuestion });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const getQuestions = async (req: Request, res: Response): Promise<void> => {
  const { quizId } = req.params; // Assuming `id` is the quizId

  try {
    const questions = await prisma.question.findMany({
      where: { quizId: quizId },
      select: {
        id: true,
        question: true,
        options: true,
        answer: true,
      },
    });

    res.status(200).json({ data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editQuestion = async (
  req: CreateQuestionRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { question, options, answer } = req.body;

  if (!question || !Array.isArray(options) || !answer) {
    res
      .status(400)
      .json({ error: "Questions, options and answer are required" });
    return;
  }

  try {
    const existedQuestion = await prisma.question.findUnique({
      where: { id },
      select: {
        quiz: {
          select: { userId: true },
        },
      },
    });

    if (!existedQuestion) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    if (existedQuestion.quiz.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden: You don't own this question" });
      return;
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        question,
        options: {
          set: options,
        },
        answer,
      },
      select: { question: true, options: true, answer: true },
    });

    res.status(200).json({
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteQuestion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const existedQuestion = await prisma.question.findUnique({
      where: { id },
      select: {
        quiz: {
          select: { userId: true },
        },
      },
    });

    if (!existedQuestion) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    if (existedQuestion.quiz.userId !== req.userId) {
      res.status(403).json({ error: "Forbidden: You don't own this question" });
      return;
    }

    await prisma.question.delete({
      where: { id },
    });

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createQuestion, getQuestions, editQuestion, deleteQuestion };
