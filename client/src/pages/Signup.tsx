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
import axios from "axios";
import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../provider/AuthContext";

interface SignupForm {
  email: string;
  password: string;
  cpassword: string;
}

export default function Signup() {
  const form = useForm<SignupForm>();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSignup = useCallback(async (data: SignupForm) => {
    const { email, password, cpassword } = data;

    if (!email || !password || !cpassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== cpassword) {
      toast.error("Password and Confirm Password must match.");
      return;
    }

    if(password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const body = {
        email,
        password,
      };
      setLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "/users/signup",
        body,
        { withCredentials: true }
      );
      login();
      toast.success(response.data.message);
      navigate("/dashboard");
      console.log(response.data);
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Card className="w-[350px] bg-[#0f0f26] text-white">
      <CardHeader className="flex justify-center items-center text-[1.25rem] gap-2">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Join Quizo and start creating amazing quizzes!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignup)}>
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
              <FormField
                control={form.control}
                name="cpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cpassword">
                      Confirm Password:{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="cpassword"
                        placeholder="Confirm your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-center space-y-2">
                <Button className="bg-teal-600 hover:bg-teal-500" type="submit">
                  {loading ? <Spinner className="w-6 h-6" /> : "Sign Up"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* <Button variant={"secondary"}>Sign Up</Button> */}
        Already have an account?&nbsp;
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
