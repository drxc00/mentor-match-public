"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    course_code: z.string().min(3, {
        message: "The course code must be at least 3 characters!"
    }).max(50),
    course_name: z.string().min(4, {
        message: "The course name must be at least 4 characters"
    }).max(50),
    description: z.string().min(1, {
        message: "The description must not be empty!"
    }),
})

export default function RequestDialog({ currDate, Time, tutor_id, refreshFunction, updateRequestDialog }:
    { currDate: any, Time: any, tutor_id: any, refreshFunction: any, updateRequestDialog: any }) {

    const router = useRouter();
    const { toast } = useToast();
    const { data: session, status }: any = useSession();
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            course_code: "",
            course_name: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { _id: student_id } = session.user;

        const response = await fetch("/api/sessionManager", {
            method: 'POST',
            body: JSON.stringify({
                tutor_id: tutor_id,
                student_id: student_id,
                course_code: values.course_code,
                course_name: values.course_name,
                description: values.description,
                date: currDate,
                start_time: Time[0],
                end_time: Time[1]
            })
        });

        if (response.status === 200) {
            setOpen(false);
            toast({
                title: "Session",
                description: "Session Requested",
            });
            
            if (refreshFunction) {
                refreshFunction();
            } else {
                router.refresh();
            }
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }

        if (updateRequestDialog) updateRequestDialog(true);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" onClick={() => form.reset()} className="bg-maroon"> Request </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-auto bg-gold">
                <DialogHeader>
                    <DialogTitle>Request Session</DialogTitle>
                    <DialogDescription>
                        Please input
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col">
                            <div>
                                <div className="flex gap-2">
                                    <FormItem className="grid py-1">
                                        <Label htmlFor="Date">Date</Label>
                                        <FormControl>
                                            <Input value={currDate.replace(/T.*/, "")} disabled={true} className="bg-white"/>
                                        </FormControl>
                                    </FormItem>
                                    <FormItem className="grid py-1">
                                        <Label htmlFor="Time">Time</Label>
                                        <FormControl>
                                            <Input value={Time[0] + " - " + Time[1]} disabled={true} className="bg-white"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="course_code"
                                    render={({ field }) => (
                                        <FormItem className="grid py-1">
                                            <Label htmlFor="course_code" >Course code</Label>
                                            <FormControl>
                                                <Input placeholder="Course code" {...field} className="bg-white"/>
                                            </FormControl>
                                        <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="course_name"
                                    render={({ field }) => (
                                        <FormItem className="grid py-1">
                                            <Label htmlFor="course_name">Course name</Label>
                                            <FormControl>
                                                <Input placeholder="Course name" {...field} className="bg-white"/>
                                            </FormControl>
                                        <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="grid py-1">
                                            <Label htmlFor="description">Description</Label>
                                            <FormControl>
                                                <Textarea placeholder="Description..." {...field} className="bg-white"/>
                                            </FormControl>
                                        <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="py-2">
                            <Button type="submit" className="bg-maroon text-white hover:bg-maroon-900">Request</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}