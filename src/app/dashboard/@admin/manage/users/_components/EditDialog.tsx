"use client";
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

const bcrypt = require("bcryptjs");


/**
 * Dialog Component for editing Users and Creating users
 * Component to be resued
 */

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
    }).min(5),
    email: z.string()
    .min(6, {
      message: "Email must be at least 6 characters long!.",
    })
    .max(80),
    password: z.string().max(80),
    role: z.string().min(2).max(80)

});



export default function EditDialogComp({ user }: any) {
    const { toast } = useToast();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user.username,
            name: user.name,
            program: user.program,
            university_number: user.university_number,
            email: user.email,
            password: "",
            role: user.role
        },
    });

    useEffect(() => {
        form.reset({
            username: user.username,
            name: user.name,
            program: user.program,
            university_number: user.university_number,
            email: user.email,
            password: "",
            role: user.role
        });
    }, [user, form]);



    async function onEditSubmit(values: z.infer<typeof formSchema>) {
        const resValues = {
            id: user._id,
            username: values.username,
            name: values.name,
            program: values.program,
            university_number: values.university_number,
            email: values.email,
            password: values.password == "" ? user.password : await bcrypt.hash(values.password, 5),
            role: values.role
        }

        const response = await fetch("/api/edit/users", {
            method: 'POST',
            body: JSON.stringify(resValues)
        })

        if (response.status === 200) {
            setOpen(false);
            toast({
                title: "Update Successfully",
                description: "User information was updated successfully.",
            });

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
                <Button onClick={() => form.reset()} className="bg-maroon-foreground hover:bg-white"><Pencil2Icon className="text-black"/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Make changes here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onEditSubmit)}>
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
                                            <Input id="username" {...field} className="col-span-3" />
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
                                            <Input id="name" {...field} className="col-span-3" />
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
                                            <Input id="program" {...field} className="col-span-3" />
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
                                            University Number
                                        </Label>
                                        <FormControl>
                                            <Input id="university_number" {...field} disabled={true} className="col-span-3" />
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
                                            <Input id="email" {...field} className="col-span-3" />
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
                                            <Input id="password" {...field} type="password" placeholder="****" className="col-span-3" />
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
                                                    <SelectValue placeholder={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
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
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}