"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorAlert from "@/components/ErrorAlert";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

const bcrypt = require("bcryptjs");

const formSchema = z.object({
  username: z
  .string()
  .min(2, {
    message: "Username must be at least 2 characters.",
  })
  .max(50),
  name: z.string()
  .min(5, {
    message: "Name must be 5 characters",
  })
  .max(80),
  university_number: z.string().regex(new RegExp(/^[0-9]*$/), {
    message: "Must only contain numbers!",
  })
  .min(6, {
    message: "University number must be at least 6 numbers for it to be valid.",
  })
  .max(80),
  email: z.string()
  .min(6, {
    message: "Email must be at least 6 characters long!.",
  })
  .max(80),
  program: z.string()
  .min(5, {
    message: "Program must be at least 5 characters long!.",
  })
  .max(80),
  password: z
    .string()
    .min(2, {
      message: "Password must be at least 2 characters.",
    })
    .max(50),
});
export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const hashedPass = await bcrypt.hash(values.password, 5);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          name: values.name,
          university_number: values.university_number,
          email: values.email,
          program: values.program,
          password: hashedPass,
          role: "student",
          tags: [],
        }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        setLoading(false);
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      university_number: "",
      email: "",
      program: "",
      password: "",
    },
  });
  return (
    <div className="flex h-screen justify-center items-center bg-gold pt-10">
      <Card className="pt-2 pb-8 w-[450px] bg-gold-muted ">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-maroon">Join Mentor Match now!</CardTitle>
          <CardDescription className="text-center text-maroon-700 text-sm">Sign up now to connect with mentors and achieve your goals with expert guidance!</CardDescription>
        </CardHeader>
        {error && error.length > 0 && (
          <div className="pl-5 pr-5">
            <ErrorAlert
              message={{
                title: "Error",
                content: error && error,
              }}
            />
          </div>
        )}
        <CardContent>
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 w-full"
              >
                <div className="flex justify-center">
                  <div className="mr-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder="Username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder="Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="university_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University Number</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder="University number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder="Email"
                              {...field}
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="program"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white"
                              placeholder="Program"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                              placeholder="Password"
                              {...field}
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  {loading ? (
                    <Button disabled className="pl-20 pr-20 bg-maroon hover:bg-maroon-700 mt-4">
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Signing Up
                    </Button>
                  ) : (
                    <Button className="pl-20 pr-20 bg-maroon mt-4" type="submit">
                      Sign Up
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
