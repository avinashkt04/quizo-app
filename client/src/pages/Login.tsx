import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../provider/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const form = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (data: LoginForm) => {
      const { email, password } = data;

      if (!email || !password) {
        toast.error("All fields are required.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          import.meta.env.VITE_BASE_URL + "/users/signin",
          data,
          { withCredentials: true }
        );

        login();
        toast.success(response.data.message);
        navigate("/dashboard");
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
    },
    [login, navigate]
  );
  return (
    <Card className="w-[350px] bg-[#0f0f26] text-white">
      <CardHeader className="flex justify-center items-center text-[1.25rem] gap-2">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Log in to Quizo and continue creating amazing quizzes!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email: </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password: </FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-center space-y-2">
                <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                  {loading ? <Spinner className="w-6 h-6" /> : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        Don&apos;t have an account?&nbsp;
        <Link to="/signup" className="text-blue-500">
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
