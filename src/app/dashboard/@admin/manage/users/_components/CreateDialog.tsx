"use client";

/**
 * Component for Create users dialog screen [admin side only]
 * 
 */
import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { redirect, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import ErrorAlert from "@/components/ErrorAlert";

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
    program: z.string()
        .min(5, {
            message: "Program must be at least 5 characters long!.",
        })
        .max(80),
    university_number: z.string().regex(new RegExp(/^[0-9]*$/), {
        message: "Must only contain numbers!",
    }).min(5, {
        message: "Must be atleast 5 numbers long!",
    }),
    email: z.string()
        .min(6, {
            message: "Email must be at least 6 characters long!.",
        })
        .max(80),
    password: z
        .string()
        .min(2, {
            message: "Password must be at least 2 characters.",
        })
        .max(50),
    role: z.string().max(80)
});


export default function CreateDialogComp() {

    const { toast } = useToast();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    /**
     * Create user form with default values [required]
     */
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            name: "",
            program: "",
            university_number: "",
            email: "",
            password: "",
            role: ""
        },
    });

    /**
    * Reset fields every trigger
    */
    useEffect(() => {
        form.reset({
            username: "",
            name: "",
            program: "",
            university_number: "",
            email: "",
            password: "",
            role: ""
        });
    }, [form]);


    async function onCreateSubmit(values: z.infer<typeof formSchema>) {

        let userRole = values.role;

        if (userRole == "tutor") {
            userRole = "tutor";
        } else {
            userRole = "student";
        }

        const response = await fetch("/api/auth/signup", {
            method: 'POST',
            body: JSON.stringify({
                username: values.username,
                name: values.name,
                program: values.program,
                university_number: values.university_number,
                email: values.email,
                password: await bcrypt.hash(values.password, 5),
                role: userRole
            })
        });

        if (response.status === 200) {
            setOpen(false);
            toast({
                title: "Success",
                description: "User created successfully.",
            });
        } else if (response.status === 400) {
            const resData = await response.json();
            setError(resData.message);
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => { form.reset(); setError(""); }} className="bg-maroon pr-5 pl-5 text-md"><PlusCircledIcon className="m-1" />Create User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>
                        Create new user here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                {error != "" ? (
                    <ErrorAlert message={{ title: "Error", content: error }} />
                ) : null}
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onCreateSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
                                        </Label>
                                        <FormControl>
                                            <Input id="username" {...field} placeholder="@username" className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <FormControl>
                                            <Input id="name" {...field} placeholder="Name" className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="program"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="program" className="text-right">
                                            Program
                                        </Label>
                                        <FormControl>
                                            <Input id="program" {...field} placeholder="Program" className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="university_number"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="university_number" className="text-right">
                                            University / Student Number
                                        </Label>
                                        <FormControl>
                                            <Input id="university_number" {...field} placeholder="Student Number" className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <FormControl>
                                            <Input id="email" {...field} placeholder="email@mapua.edu.ph" className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            Password
                                        </Label>
                                        <FormControl>
                                            <Input id="password" type="password" {...field} placeholder="Password" className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Student" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="tutor">Tutor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>

                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="bg-maroon">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}