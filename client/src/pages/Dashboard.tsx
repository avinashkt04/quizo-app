import { useEffect, useState } from "react";
import QuizCard from "../components/QuizCard";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import axios from "axios";
import QuizForm from "../components/QuizForm";

function Dashboard() {
  const [quizzes, setQuizzes] = useState<
    { id: string; title: string; description: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);

  const handleFetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "/quizzes/get-quizzes",
        { withCredentials: true }
      );
      setQuizzes(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.error(error.response.data.error);
        } else {
          console.error("An unexpected error occurred. Please try again.");
        }
      } else {
        console.error("Non-Axios error:", error);
        console.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuiz = (quiz: {
    id: string;
    title: string;
    description: string;
  }) => {
    setQuizToEdit(quiz);
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    handleFetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen p-4 w-[90%] sm:w-[80%] mx-auto m-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 m-4">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Button
          className="bg-green-500 hover:bg-green-600 text-md"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create Quiz
        </Button>
      </div>

      {/* Create Quiz Dialog */}
      <QuizForm
        isDialogOpen={isCreateDialogOpen}
        setIsDialogOpen={setIsCreateDialogOpen}
        handleFetchQuizzes={handleFetchQuizzes}
      />

      {/* Edit Quiz Dialog */}
      <QuizForm
        isDialogOpen={isEditDialogOpen}
        setIsDialogOpen={setIsEditDialogOpen}
        handleFetchQuizzes={handleFetchQuizzes}
        editMode={true}
        quizData={quizToEdit}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-32 w-full bg-[#1F1D36]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {quizzes.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <p className="text-gray-500 text-center">No quizzes added yet.</p>
            </div>
          ) : (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                handleFetchQuizzes={handleFetchQuizzes}
                handleEditQuiz={handleEditQuiz}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
