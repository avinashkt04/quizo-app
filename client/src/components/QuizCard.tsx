import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "./Spinner";
import { Link } from "react-router-dom";

function QuizCard({
  quiz,
  handleFetchQuizzes,
  handleEditQuiz,
}: {
  quiz: { id: string; title: string; description: string; createdAt: string };
  handleFetchQuizzes: () => void;
  handleEditQuiz: (quiz: {
    id: string;
    title: string;
    description: string;
  }) => void;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleDeleteQuiz = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        import.meta.env.VITE_BASE_URL + `/quizzes/delete-quiz/${id}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      handleFetchQuizzes();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        console.error("Non-Axios error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card key={quiz.id} className="bg-[#1F1D36] text-white">
        <CardHeader>
          <Link
            to={`/quiz/${quiz.id}`}
            className="hover:underline text-lg font-semibold"
          >
            <CardTitle>{quiz.title}</CardTitle>
          </Link>
          <CardDescription className="text-md text-gray-400">
            {quiz.description}
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardContent>
            <p className="text-sm text-gray-500">
              Created on: {new Date(quiz.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              onClick={() => handleEditQuiz(quiz)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteQuiz(quiz.id)}
              className="w-full sm:w-auto"
            >
              {loading ? <Spinner className="w-6 h-6" /> : "Delete Quiz"}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}

export default QuizCard;
