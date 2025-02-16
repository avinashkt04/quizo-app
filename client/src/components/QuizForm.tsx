import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "./Spinner";

interface QuizFormProps {
  title: string;
  description: string;
}

function QuizForm({
  isDialogOpen,
  setIsDialogOpen,
  handleFetchQuizzes,
  editMode = false,
  quizData = null,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFetchQuizzes: () => void;
  editMode?: boolean;
  quizData?: { id: string; title: string; description: string } | null;
}) {
  const form = useForm<QuizFormProps>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && quizData) {
      form.reset({
        title: quizData.title,
        description: quizData.description,
      });
    } else {
      form.reset({
        title: "",
        description: "",
      });
    }
  }, [editMode, quizData, form]);

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  const handleSubmit = useCallback(
    async (data: QuizFormProps) => {
      const { title, description } = data;

      if (!title || !description) {
        toast.error("All fields are required.");
        return;
      }

      try {
        setLoading(true);
        if (editMode && quizData) {
          await axios.put(
            `${import.meta.env.VITE_BASE_URL}/quizzes/edit-quiz/${quizData.id}`,
            { title, description },
            { withCredentials: true }
          );
          toast.success("Quiz updated successfully!");
        } else {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/quizzes/create-quiz`,
            { title, description },
            { withCredentials: true }
          );
          toast.success("Quiz created successfully!");
        }

        form.reset();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data && error.response.data.error) {
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
        setIsDialogOpen(false);
        handleFetchQuizzes();
      }
    },
    [editMode, quizData, setIsDialogOpen, handleFetchQuizzes, form]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-[#0f0d1d] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editMode ? "Edit Quiz" : "Create Quiz"}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {editMode
              ? "Update the details for your quiz."
              : "Enter the details for your new quiz."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title: </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Quiz Title"
                      type="text"
                      className="bg-[#0f0d1d] text-white border-gray-600"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description: </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Quiz Description"
                      className="bg-[#0f0d1d] text-white border-gray-600 my-2"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 mt-2"
            >
              {loading ? (
                <Spinner className="w-6 h-6" />
              ) : editMode ? (
                "Update Quiz"
              ) : (
                "Create Quiz"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default QuizForm;