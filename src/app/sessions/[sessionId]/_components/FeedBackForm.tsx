"use client";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorAlert from "@/components/ErrorAlert";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    feedback: z.string().min(5),
});

export default function FeedBackForm({ isStudent, session, student, tutor }:
    { isStudent: boolean, session: string, student: string, tutor: string }) {

    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    const { toast } = useToast();
    const router = useRouter()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            feedback: "",
        },
    });


    async function onSubmitFeedback(data: z.infer<typeof formSchema>) {
        if (rating == 0) {
            setError("Please rate your tutor");
            return;
        }

        const response = await fetch("/api/feedback/", {
            method: 'POST',
            body: JSON.stringify({
                session: session,
                reviewer: isStudent ? student : tutor, // if the current user is a student this means that thei are the ones reviewing
                reviewee: isStudent ? tutor : student, // if the current user is a student then the person being reviewed is the tutor,
                rating: rating,
                feedback: data.feedback
            })
        });


        if (response.ok) {
            setError("")
            setRating(0);
            console.log(JSON.stringify({
                rating: rating,
                feedback: data.feedback
            }));
            

            toast(
                {
                    title: "Feedback Sent",
                    description: "Your feedback has been sent."
                }
            )
        }

        router.refresh();
        form.reset()
    }


    return (
        <div className="mt-5">

            <div className="items-center justify-center w-auto container">
                <Card className="bg-gold border-none">
                    <CardContent>
                        <Card>
                            <CardContent>
                                <div className="flex flex-col justify-center items-center py-4">
                                    {error != "" ? (<ErrorAlert message={{ title: "Invalid Rating", content: error }} />) : (null)}
                                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Rate your {isStudent ? ("tutor") : ("student")}</h2>
                                    <ToggleGroup type="single" onValueChange={(value) => setRating(parseInt(value))} defaultValue={rating.toString()} variant="outline">
                                        <ToggleGroupItem value="1" aria-label="1">
                                            {rating >= 1 ? (<StarFilledIcon />) : (<StarIcon />)}
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="2" aria-label="2" >
                                            {rating >= 2 ? (<StarFilledIcon />) : (<StarIcon />)}
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="3" aria-label="3" >
                                            {rating >= 3 ? (<StarFilledIcon />) : (<StarIcon />)}
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="4" aria-label="4">
                                            {rating >= 4 ? (<StarFilledIcon />) : (<StarIcon />)}
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="5" aria-label="5">
                                            {rating >= 5 ? (<StarFilledIcon />) : (<StarIcon />)}
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmitFeedback)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="feedback"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Feedback</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Leave your feedback here" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}