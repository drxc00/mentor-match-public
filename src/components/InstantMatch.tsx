"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { topics } from "@/utils/topics";
import { NextURL } from "next/dist/server/web/next-url";
import AvailableTutors from "./AvailableTutors";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import { ReloadIcon } from "@radix-ui/react-icons";



const FormSchema = z.object({
    sessionDate: z.date({
        required_error: "Session date required."
    }),
    topic: z.string({
        required_error: "Please select a topic."
    }),
    time: z.string({
        required_error: "Please select a time frame."
    }),
});

export default function InstantMatch() {
    const [tutors, setTutors]: any = useState([])
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [topic, setTopic] = useState(null);
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    let unavailableTutors: string[] = []


    const time: any = [
        "7:30 AM - 9:00 AM",
        "9:00 AM - 10:30 AM",
        "10:30 AM - 12:00 PM",
        "12:00 PM - 1:30 PM",
        "1:30 PM - 3:00 PM",
        "3:00 PM - 4:30 PM"
    ]

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    async function fetchSessions(date: any, start_time: any, end_time: any) {
        /**
         * Function that fetch sessions to find tutors that are not available
         */
        const session_response = await fetch("/api/data/sessions?" + new URLSearchParams({
            session_date: date,
            start_time: start_time,
            end_time: end_time
        }), {
            method: 'GET',
            cache: "no-store"
        });
        const parsed_session_response = await session_response.json();


        return parsed_session_response;
    }

    async function fetchTutors(topic_value: string) {
        /**
         * Fetch tutors that are available based on the filters
         * Passes an array of excluded tutor ids and the topic filter
         * 
         */
        const response = await fetch("/api/tutor?" + new URLSearchParams({
            excluded_tutor_ids: unavailableTutors.toString(),
            topic: topic_value
        }), {
            method: 'GET',
            cache: "no-store"
        })

        const parsed_response = await response.json();

        return parsed_response.body.tutors;

    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        setLoading(true);

        const temp_tutors_array: any = [];
        const topic = data.topic;
        const _time = data.time.split(" - ");

        const start_time = _time[0];
        const end_time = _time[1];

        const _splitTime = start_time.split(/:| /);
        const _hour = parseInt(_splitTime[0], 10); //base 10
        const _minute = _splitTime[1]

        const _defaultHour = _hour < 10 ? `0${_hour}` : _hour

        const sTime = `${_splitTime[2].toUpperCase() === "PM" && _hour < 12 ? _hour + 12 : _defaultHour}:${_minute}`

        const sDate = new Date(data.sessionDate.setDate(data.sessionDate.getDate() + 1));

        const date = new Date(sDate.toISOString().replace(/T.*/, `T${sTime}:00.000Z`));

        const isoString = date.toISOString();

        const dateIndex = date.getDay() - 1; // to be used to check schedules
        const timeIndex = time.indexOf(data.time);

        const sessionsResponse: any = await fetchSessions(isoString, start_time, end_time);

        const sessions: any = sessionsResponse.result;
        const schedules: any = sessionsResponse.schedules;

        // add unavailable tutors from the database
        sessions.map((session: any) => {
            if (!unavailableTutors.includes(session)) unavailableTutors.push(session.tutor);
        });


        /**
         * maps the schedules in response
         * it checks the permamnent_indexes of the schedule if it includes
         * an array matching the selected date and time 
         * 
         * it checks the transient_dates if the selected date and time slot
         * is inside the array
         */
        schedules.map((schedule: any) => {

            const includesPermanentIndex = schedule.permanent_indexes.some((arr: any) => (
                arr[0] == timeIndex && arr[1] == dateIndex
            ));

            const includesTransientIndex = schedule.transient_dates.some((date: any) => (
                date.date.replace(/T.*/, '') == isoString.replace(/T.*/, '') &&
                date.start_time == start_time && date.end_time == end_time
            ))

            if (includesPermanentIndex || includesTransientIndex) unavailableTutors.push(schedule.tutor);
        })


        const tutorsAvailable = await fetchTutors(topic);

        tutorsAvailable.map((tutor: any) => {
            if (!tutors.includes(tutor)) temp_tutors_array.push(tutor);
        });

        setTutors(temp_tutors_array);
        setSelectedDate(isoString as any);
        setStartTime(start_time as any);
        setEndTime(end_time as any);
        setTopic(topic as any);

        setLoading(false);

        if (temp_tutors_array.length > 0) {
            toast({
                title: "Tutors found!",
                description: "Here are the available tutors for that specific date, time, and expertise"
            })
        } else {
            toast({
                title: "There are no tutors found! :(",
                description: "Sorry, there are no tutors that meet that criteria, consider changing the criteria or try again at another time."
            })
        }
    }

    return (
        <div className="my-5 flex flex-col md:flex-row ">
            <div className="px-5">

                <Card className="w-full max-w-sm text-left bg-gold-muted border-gold-500 text-maroon shadow-md">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-2xl">Instant Match</CardTitle>
                        <CardDescription className="">Refine your tutor search with the following filters</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="mt-5 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="sessionDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm">Session date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "pl-3 text-left font-normal bg-gold-200",
                                                                !field.value && "text-black shadow-none"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date() || date.getDay() == 6 || date.getDay() == 0
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="topic"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm">Topic</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl className="bg-gold-muted text-black shadow-none ">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a topic" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {topics.map((topic: string, index: number) => (
                                                        <SelectItem key={index} value={topic}>{topic}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm">Time</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl className=" bg-gold-muted text-black shadow-none">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a time frame" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {time.map((t: string, index: number) => (
                                                        <SelectItem key={index} value={t}>{t}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                            </CardContent>
                            <CardFooter className="flex justify-end pt-4">
                                {!loading ? (
                                    <Button type="submit" className="flex justify-end bg-maroon hover:bg-maroon-900">Find tutor</Button>
                                ) : (
                                    <Button disabled className="flex justify-end bg-maroon hover:bg-maroon-900">
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Looking for Tutor
                                    </Button>
                                )}

                            </CardFooter>

                        </form>
                    </Form>
                </Card>
            </div>
            <div>
                {tutors.length != 0 ? (
                    <div className="flex flex-col shadow-xl">
                        <Card className="w-full h-full max-w-xl text-left bg-gold-300 border-gold-500 text-maroon">
                            <CardHeader>
                                <CardTitle className="text-2xl">Tutors Available ({tutors.length})</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent>
                                <AvailableTutors tutors={tutors} sessionDate={selectedDate} topic={topic} startTime={startTime} endTime={endTime} />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div >
    );
}