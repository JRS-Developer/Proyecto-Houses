"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosAPI, handleAxiosError } from "@/lib/axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  email: z
    .string({
      required_error: "The email is required",
      invalid_type_error: "The email is invalid",
    })
    .email(),
  password: z
    .string({
      required_error: "The password is required",
    })
    .min(1, "The password is required"),
});

type FormSchema = z.infer<typeof formSchema> & {
  responseError: string | null;
};

const Login = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      responseError: null,
    },
  });

  const { setToken, initializeAuth } = useAuthStore(
    (s) => ({
      setToken: s.setToken,
      initializeAuth: s.initialize,
    }),
    shallow
  );

  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { isSubmitting, errors },
  } = form;

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const res = await axiosAPI.post<{ access_token: string }>(
        "/auth/login",
        data
      );

      setToken(res.data.access_token);
      initializeAuth();

      push("/dashboard");
    } catch (e) {
      handleAxiosError(e, (m) => {
        console.log(m);
        setError("responseError", {
          message: m,
        });
      });
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {errors?.responseError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errors?.responseError?.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <div className="text-sm">
                        <Link
                          href="#"
                          className="underline underline-offset-4 hover:text-primary"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>

                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Login;
