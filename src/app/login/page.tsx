"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSearchParams } from "next/navigation";

//form schema
const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Login name must be at least 2 characters.",
    })
    .max(50),
  password: z
    .string()
    .min(2, {
      message: "Login name must be at least 2 characters.",
    })
    .max(50),
});

const errors: any = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};
const SignInError = () => {

  const params = useSearchParams();
  const error: any = params.get("error");


  const errorMessage = error ? errors[error] : errors.default;
  return (<div className={`pl-5 pr-5 ${error ? ('block') : ('hidden')}`}>
    <ErrorAlert
      message={{
        title: "Error",
        content: errorMessage,
      }}
    />
  </div>);
};

export default function Login() {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // const params = useSearchParams();
  // const error = params.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "student") {
        redirect("/");
      } else {
        redirect("/dashboard");
      }
    }
  }, [session, status, router]);

  //submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: true,
        username: values.username,
        password: values.password,
        callbackUrl: "/",
      });

    } catch (err: any) {

    }
  }

  // form init
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //render
  return (
    <div className="flex h-screen justify-center items-center bg-gold">
      <Card className="pt-2 pb-8 w-[450px] bg-gold-muted">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-maroon">Sign in to Mentor Match</CardTitle>
          <CardDescription className="text-maroon-700 text-sm">
            So you can start finding tutor or become one yourself!
          </CardDescription>
        </CardHeader>
        <SignInError />
        <div className="p-5 ml-2 mr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-full"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Login name"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {loading ? (
                  <Button disabled className="pl-20 pr-20 bg-maroon hover:bg-maroon-700 mt-4">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Logging in
                  </Button>
                ) : (
                  <Button className="pl-20 pr-20 bg-maroon mt-4" type="submit">
                    Login
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
