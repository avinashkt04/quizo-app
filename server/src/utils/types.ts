import { Request } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export interface SignUpRequest extends Request {
    body: {
        email: string
        password: string
    }
}

export interface CreateQuizRequest extends AuthRequest {
    body: {
        title: string
        description: string
    }
}

export interface CreateQuestionRequest extends AuthRequest {
    body: {
        question: string
        options: string[]
        answer: string
        quizId: string
    }
}
