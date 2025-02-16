import { useEffect, useState, useRef } from "react"; 
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import QuestionForm from "../components/QuestionForm";

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    answer: string;
  }[];
}

function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<{
    id: string;
    question: string;
    options: string[];
    answer: string;
  } | null>(null);

  const formRef = useRef<HTMLDivElement>(null); 

  const fetchQuizAndQuestions = async () => {
    try {
      setLoading(true);

      const quizResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/quizzes/get-quiz/${id}`,
        { withCredentials: true }
      );

      const questionsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/${id}/get-questions`,
        { withCredentials: true }
      );

      setQuiz({
        ...quizResponse.data.data,
        questions: questionsResponse.data.data,
      });
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

  const handleAddQuestion = async (data: {
    question: string;
    options: string[];
    answer: string;
  }) => {
    if (!data.question || data.options.some((opt) => !opt) || !data.answer) {
      toast.error("All fields are required.");
      return;
    }

    if (!data.options.includes(data.answer)) {
      toast.error("Answer must be one of the options.");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (editingQuestion) {
        response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/${id}/edit-question/${
            editingQuestion.id
          }`,
          data,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${id}/add-question`,
          data,
          { withCredentials: true }
        );
      }

      toast.success(response.data.message);
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
      setEditingQuestion(null);
      fetchQuizAndQuestions();
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

  const handleEditQuestion = (question: {
    id: string;
    question: string;
    options: string[];
    answer: string;
  }) => {
    setEditingQuestion(question);
    setQuestion(question.question);
    setOptions(question.options);
    setAnswer(question.answer);

    // Scroll to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/${id}/delete-question/${questionId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchQuizAndQuestions();
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

  useEffect(() => {
    fetchQuizAndQuestions();
  }, [id]);

  if (!quiz) {
    return <Spinner className="w-12 h-12 mx-auto mt-8" />;
  }

  return (
    <div className="min-h-screen w-[90%] sm:w-[80%] mx-auto p-2 sm:p-6">
      <div className="flex flex-col md:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold">{quiz.title}</h1>
          <p className="text-gray-300">{quiz.description}</p>
        </div>

        <div className="bg-slate-800 p-2 rounded-md text-center sm:text-right">
          <span className="text-lg font-semibold">
            Total Questions: {quiz.questions.length}
          </span>
        </div>
      </div>

      <div ref={formRef}>
        <QuestionForm
          mode={editingQuestion ? "edit" : "create"}
          question={question}
          options={options}
          answer={answer}
          loading={loading}
          onQuestionChange={(e) => setQuestion(e.target.value)}
          onOptionChange={(index, value) => {
            const newOptions = [...options];
            newOptions[index] = value;
            setOptions(newOptions);
          }}
          onAnswerChange={(e) => setAnswer(e.target.value)}
          onSubmit={handleAddQuestion}
        />
      </div>

      <div className="space-y-4 mt-6">
        {quiz.questions.length === 0 ? (
          <p className="text-gray-500 text-center">No questions added yet.</p>
        ) : (
          quiz.questions.map((q) => (
            <div
              key={q.id}
              className="bg-[#1F1D36] p-4 sm:p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                {q.question}
              </h3>

              <div className="mb-3">
                <label className="block text-gray-300 mb-2">
                  Select an option:
                </label>
                <div className="flex flex-col space-y-2">
                  {q.options.map((opt, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        className="form-radio h-4 w-4 sm:h-5 sm:w-5 text-blue-500"
                      />
                      <span className="text-white">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <p className="text-green-500 mt-2 sm:mt-0">
                  Correct Answer: {q.answer}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditQuestion(q)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuizPage;