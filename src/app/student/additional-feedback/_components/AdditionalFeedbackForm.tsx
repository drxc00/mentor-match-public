"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AdditionalFeedbackBtn from "@/components/AdditionalFeedbackBtn";
import { Divide } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


export default function AdditionalFeedbackForm({ userId, selectedSession, tutorOfSession } : any) {
    // console.log(userId)
    const router = useRouter();
    const inputRef: any = useRef(null);
    const FormSchema = z.object({
        bio: z
          .string()
          .min(10, {
            message: "Feedback must be at least 10 characters.",
          })
      })
        
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            bio: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // event.preventDefault();

        // const formData = new FormData(event.currentTarget)
        var additionalFeedbackContent = data.bio

        //await sendMessage(additional_feedback); //idk if this should be included
        //console.log("message: ", messageContent); 

        console.log(additionalFeedbackContent)
        const res = await fetch(`/api/additionalFeedback/sendAdditionalFeedback`, {
            method: 'POST',
            body: JSON.stringify({
                session: selectedSession,
                reviewer: userId,
                reviewee: tutorOfSession,
                additional_feedback: additionalFeedbackContent
            })
        });

        if (!res.ok) {
            console.log("Error in sending additional feedback!");
        
            } else {
                toast({
                    title: "Thank you for your feedback!"
                })
                router.push('/student/sessions');
        }

        router.refresh();
        // inputRef!.current!.value = '';
        
        
    }


    return (
        <div className="container mt-20 flex-col h-full justify-center items-center">
            <div className="flex flex-col text-center items-center justify-center">
                <h1 className="flex-col h-full justify-center items-center mt-10 pb-6 text-3xl font-semibold text-maroon">Tell us about your experience!</h1>
            </div>

            <div>
            <Form {...form}>
                <form id="form" onSubmit={form.handleSubmit(onSubmit)} className="items-center space-y-6">
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type here..."
                                        className="resize-none h-[25vh] bg-gold-muted"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="bg-maroon hover:bg-maroon-700">Send</Button>
                </form>
                <p id="log"></p>
            </Form>
            </div>
            
            {/* <div className="p-4">
                <form id="form" onSubmit={onSubmit}   >
                    <div className="flex items-center gap-2">
                        <Input ref={inputRef} placeholder="Type here... " type="text"/>
                        <Button onClick={onClick}>Send</Button>
                    </div>
                </form>
            </div> */}
        </div>
        
    )
}