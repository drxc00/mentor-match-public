"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DateTable from "./DateTable";

export default function DatePagination({
    tutorId
}: any) {

    const router = useRouter();

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
        <div className="flex flex-col items-center mt-4">
            <div className="flex gap-7 items-center mb-4 bg-gold-500 p-2 rounded-xl">
                <Button onClick={handlePrevWeek} className="bg-maroon-900" size="sm"><ChevronLeft /></Button>
                <div className="scroll-m-20 text-xl font-semibold tracking-tight text-maroon-900">
                    {firstDayISO} - {lastDayISO}
                </div>
                <Button onClick={handleNextWeek} className="bg-maroon-900" size="sm"><ChevronRight /></Button>
            </div>
            <div className="w-full">
                <DateTable tutor_id={tutorId} firstDay={firstDayISO} lastDay={lastDayISO} />
            </div>
        </div>
    );
}