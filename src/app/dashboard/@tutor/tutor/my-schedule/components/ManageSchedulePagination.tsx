"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Settings2Icon } from "lucide-react";
import ManageScheduleTable from "./ManageScheduleTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type selectType = {
    index: number[],
    date: string,
    time: string[]
}

const FormSchema = z.object({
    date: z.string().min(1, {
        message: "Date is required"
    }),
    time: z.string().min(1, {
        message: "Time is required"
    }),
    permanent: z.boolean().default(false).optional(),
})

export default function ManageSchedulePagination({
    tutorId
}: any) {

    const defaultSelected: selectType = {
        index: [-1, -1],
        date: "",
        time: ["", ""]
    }

    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState<selectType>(defaultSelected);
    const [refreshChild, setRefreshChild] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: "",
            time: "",
            permanent: true,
        },
    })

    useEffect(() => {
        // Update the form values whenever selectedIndex changes
        if (selectedIndex) {
            // Trigger the form.setValue method to update the form values
            form.setValue('date', selectedIndex.date.replace(/T.*/, ''));
            form.setValue('time', `${selectedIndex.time[0]} - ${selectedIndex.time[1]}`);
        }
    }, [selectedIndex, form]);



    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const { date, time, permanent } = data

        const time_split = time.split(" - ");
        let reqBody;

        if (permanent) {
            reqBody = {
                tutor_id: tutorId,
                xIndex: selectedIndex.index[0],
                yIndex: selectedIndex.index[1],
            }
        } else {
            reqBody = {
                tutor_id: tutorId,
                transient_date: {
                    date: new Date(date),
                    start_time: time_split[0],
                    end_time: time_split[1]
                }
            }
        }

        const response = await fetch("/api/schedule/", {
            method: "POST",
            body: JSON.stringify(reqBody)
        });

        if (response.ok) {
            toast({
                title: "Schedule set",
                description: "Your schedule has been updated",
            })
        }

        form.reset();
        setSelectedIndex(defaultSelected);
        setRefreshChild(true);
        

    }

    const localTimezoneDate = new Date(); // get local timezone
    localTimezoneDate.setTime(localTimezoneDate.getTime() + (8 * 60 * 60 * 1000)); // Subtract 480 minutes (UTC+8)


    const [date, setDate] = useState(new Date(localTimezoneDate));


    const __firstDay = new Date(date);

    __firstDay.setTime(__firstDay.getTime() + (8 * 60 * 60 * 1000)); // philippines gmt
    __firstDay.setDate(__firstDay.getDate() - __firstDay.getDay() + 1); // Set to the first day of the week

    const firstDay = new Date();
    firstDay.setTime(__firstDay.getTime() + (8 * 60 * 60 * 1000));

    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 4); // Assuming you want a 5-day week (Monday to Friday)

    const handlePrevWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 7);
        setDate(newDate);
        router.refresh();
    };

    const handleNextWeek = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 7);
        setDate(newDate);
        router.refresh();
    };

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const current_month = month[date.getMonth()];
    const current_year = date.getFullYear();

    /**
     * Uses Convert Day to ISO Date format
     */
    const firstDayISO = new Date(firstDay).toISOString().split('T')[0];
    const lastDayISO = new Date(lastDay).toISOString().split('T')[0];

    return (
        <>
            <div className="flex flex-col items-center mt-2">
                <div className="flex gap-7 items-center mb-4 bg-gold-500 p-2 rounded-xl">
                    <Button onClick={handlePrevWeek} className="bg-maroon-900" size="sm"><ChevronLeft /></Button>
                    <div className="scroll-m-20 text-xl font-semibold tracking-tight text-maroon-900">
                        {firstDayISO} - {lastDayISO}
                    </div>
                    <Button onClick={handleNextWeek} className="bg-maroon-900" size="sm"><ChevronRight /></Button>
                </div>
                <div className="w-full grid lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-3 md:row-span-1">
                        <ManageScheduleTable
                            tutor_id={tutorId}
                            firstDay={firstDayISO}
                            lastDay={lastDayISO}
                            setSelectedIndex={setSelectedIndex}
                            selectedIndex={selectedIndex}
                            refresh={() => router.refresh()}
                        />
                    </div>
                    <div className="bg-gold-muted rounded-xl border shadow-sm lg:col-span-2  md:row-span-1 p-3">
                        <Card className="bg-gold-200">
                            <CardHeader>
                                <CardTitle className="flex gap-1 items-center"><Settings2Icon size={15} />Options</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-maroon">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="date"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Selected Date" {...field}
                                                                value={selectedIndex?.date.replace(/T.*/, '')}
                                                                type="text"
                                                                className="bg-white"
                                                                disabled
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="time"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Time</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Selected Time" {...field}
                                                                value={`${selectedIndex?.time[0]} - ${selectedIndex?.time[1]}`}
                                                                type="text"
                                                                className="bg-white"
                                                                disabled
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="permanent"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 ">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>
                                                                Set Permanent
                                                            </FormLabel>
                                                            <FormDescription>
                                                                This option will designate the selected date and time as unavailable consistently across all weeks.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="bg-maroon hover:bg-maroon-900">Submit</Button>
                                        </form>
                                    </Form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
