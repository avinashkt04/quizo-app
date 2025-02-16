import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const existedUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existedUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: { id: true, email: true },
    });

    const options = {
      httpOnly: true,
      secure: true
    };

    res
      .cookie("userId", user.id, options)
      .status(201)
      .json({ message: "User registered successfully", data: user });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid Credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid Credentials" });
      return;
    }

    const { password: _, ...resUser } = user;

    const options = {
      httpOnly: true,
      secure: true
    };

    res
    .status(200)
    .cookie("userId", user.id, options)
      .json({ message: "Sign in successfully", data: resUser });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const signOut = async (req: Request, res: Response): Promise<void> => {
  res
    .clearCookie("userId")
    .status(200)
    .json({ message: "Sign out successfully" });
  return;
};

const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, quizzes: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const checkAuth = async (req: Request, res: Response): Promise<void> => {
  const userId = req.cookies.userId;

  if (!userId) {
    res.status(200).json({ isAuthenticated: false });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      res.status(200).json({ isAuthenticated: false });
      return;
    }

    res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { signUp, signIn, signOut, getUser, checkAuth };