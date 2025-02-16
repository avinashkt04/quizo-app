import React, { useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/Spinner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";

interface QuestionFormProps {
  mode: "create" | "edit";
  question: string;
  options: string[];
  answer: string;
  loading: boolean;
  onQuestionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onOptionChange: (index: number, value: string) => void;
  onAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: {
    question: string;
    options: string[];
    answer: string;
  }) => void;
}

function QuestionForm({
  mode,
  question,
  options,
  answer,
  loading,
  onQuestionChange,
  onOptionChange,
  onAnswerChange,
  onSubmit,
}: QuestionFormProps) {
  const form = useForm({
    defaultValues: {
      question: question,
      options: options,
      answer: answer,
    },
  });

  useEffect(() => {
    form.reset({
      question: question,
      options: options,
      answer: answer,
    });
  }, [question, options, answer, form]);

  const handleSubmitQuestion = (data: {
    question: string;
    options: string[];
    answer: string;
  }) => {
    onSubmit(data);
  };

  return (
    <div className="relative p-4 sm:p-8 rounded-lg shadow-lg transform">
      <div className="absolute opacity-20 rounded-lg transform"></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitQuestion)}
          className="relative space-y-4"
        >
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "Create Question" : "Edit Question"}
          </h2>

          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="question">Question: </FormLabel>
                <FormControl>
                  <Textarea
                    id="question"
                    placeholder="Question"
                    className="bg-[#1F1D36] text-white border-gray-600"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onQuestionChange(e);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options: </FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {options.map((opt, index) => (
                    <FormControl key={index}>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={opt}
                        className="bg-[#1F1D36] text-white border-gray-600"
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          field.onChange(newOptions);
                          onOptionChange(index, e.target.value);
                        }}
                      />
                    </FormControl>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="answer">Correct Answer: </FormLabel>
                <FormControl>
                  <Input
                    id="answer"
                    placeholder="Correct Answer"
                    className="bg-[#1F1D36] text-white border-gray-600"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onAnswerChange(e);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 w-full"
          >
            {loading ? (
              <Spinner className="w-6 h-6" />
            ) : mode === "create" ? (
              "Add Question"
            ) : (
              "Update Question"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default QuestionForm;
