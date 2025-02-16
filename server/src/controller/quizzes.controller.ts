import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { CreateQuizRequest } from "../utils/types";

const prisma = new PrismaClient();

const createQuiz = async (
  req: CreateQuizRequest,
  res: Response
): Promise<void> => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        user: {
          connect: { id: req.userId },
        },
      },
    });

    res.status(201).json({ message: "Quiz created successfully", data: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuizzes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        title: true,
        description: true,
        questions: true,
        createdAt: true,
      },
    });

    res.status(200).json({ data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuiz = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    res.status(200).json({ data: quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editQuiz = async (
  req: CreateQuizRequest,
  res: Response
): Promise<void> => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  try {
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({ where: { id } });

      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return null;
      }

      if (quiz.userId !== req.userId) {
        res.status(403).json({ error: "Forbidden" });
        return null;
      }

      return await tx.quiz.update({
        where: { id },
        data: { title, description },
      });
    });

    if (!updatedQuiz) return;

    res
      .status(200)
      .json({ message: "Quiz updated successfully", data: updatedQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({ where: { id } });

      if (!quiz) {
        res.status(404).json({ error: "Quiz not found" });
        return null;
      }

      if (quiz.userId !== req.userId) {
        res.status(403).json({ error: "Forbidden" });
        return null;
      }

      await tx.quiz.delete({ where: { id } });
      return true;
    });

    if (!result) return;

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createQuiz, getQuizzes, getQuiz, editQuiz, deleteQuiz };
