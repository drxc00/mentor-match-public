"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import RequestDialog from "@/components/RequestDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DateTable({ firstDay, lastDay, tutor_id }:
    { firstDay: string, lastDay: string, tutor_id: string }) {

    const router = useRouter();
    let dateOBJ = new Date(firstDay);

    const currentDay = new Date().toISOString(); // current day

    const [tutorSessionsData, setTutorSessionsData]: any = useState();
    const [requestDialogSubmitted, isRequestDialogSubmitted] = React.useState<Boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tutorSessionsResponse = await fetch(
                    "/api/data/sessions?" +
                    new URLSearchParams({
                        tutor_id: tutor_id,
                        firstDay: firstDay,
                        lastDay: lastDay,
                    }),
                    { method: "GET", cache: "no-store" }
                );

                const data = await tutorSessionsResponse.json();
                setTutorSessionsData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        isRequestDialogSubmitted(false);
    }, [firstDay, lastDay, tutor_id, requestDialogSubmitted]);


    /**
     * Current dates of the week, each index represent the day of the week
     */
    let datesISO = [
        dateOBJ.toISOString(),
        new Date(dateOBJ.setDate(dateOBJ.getDate() + 1)).toISOString(),
        new Date(dateOBJ.setDate(dateOBJ.getDate() + 1)).toISOString(),
        new Date(dateOBJ.setDate(dateOBJ.getDate() + 1)).toISOString(),
        new Date(dateOBJ.setDate(dateOBJ.getDate() + 1)).toISOString(),
    ]

    /**
     * Time header, an array of tuples containing ranges of time slots -
     * similar to myMapua schedule
     */
    const timeHeader = [
        ["7:30 AM", "9:00 AM"],
        ["9:00 AM", "10:30 AM"],
        ["10:30 AM", "12:00 PM"],
        ["12:00 PM", "1:30 PM"],
        ["1:30 PM", "3:00 PM"],
        ["3:00 PM", "4:30 PM"]
    ]


    return (
        <div >
            <Table className=" rounded-xl bg-gold-500">
                <TableHeader className="rounded-xl bg-maroon text-center">
                    <TableRow className="hover:bg-maroon-900">
                        <TableHead className="w-1/6 text-white text-center">Time </TableHead>
                        <TableHead className="w-1/6 text-white gap-2 text-center">Monday <Badge className=" bg-maroon-mono hover:bg-maroon">{datesISO[0].replace(/T.*/, "")}</Badge></TableHead>
                        <TableHead className="w-1/6 text-white text-center">Tuesday <Badge className=" bg-maroon-mono hover:bg-maroon">{datesISO[1].replace(/T.*/, "")}</Badge></TableHead>
                        <TableHead className="w-1/6 text-white text-center">Wednesday <Badge className=" bg-maroon-mono hover:bg-maroon">{datesISO[2].replace(/T.*/, "")}</Badge></TableHead>
                        <TableHead className="w-1/6 text-white text-center">Thursday <Badge className=" bg-maroon-mono hover:bg-maroon">{datesISO[3].replace(/T.*/, "")}</Badge></TableHead>
                        <TableHead className="w-1/6 text-white text-center">Friday <Badge className=" bg-maroon-mono hover:bg-maroon">{datesISO[4].replace(/T.*/, "")}</Badge></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center hover:none">
                    {timeHeader.map((time, timeIndex) => (
                        <TableRow key={timeIndex}>
                            <TableCell >
                                <div className="font-medium">
                                    {time[0] + " - " + time[1]}
                                </div>
                            </TableCell>
                            {datesISO.map((date, dateIndex) => {
                                /**
                                 * isUnavailable uses javascripts .some function
                                 * this checks if the instance of the time and date exsist in the queried session
                                 */
                                const isUnavailable = tutorSessionsData?.result.some((session: any) => (
                                    session.date.replace(/T.*/, "") === date.replace(/T.*/, "") &&
                                    session.start_time === time[0] && session.end_time === time[1] &&
                                    session.status != "Cancel"
                                ));

                                const isScheduledTransient = tutorSessionsData?.schedule[0].transient_dates.some((schedule: any) => (
                                    schedule.date.replace(/T.*/, "") === date.replace(/T.*/, "") &&
                                    schedule.start_time === time[0] && schedule.end_time === time[1]
                                ));


                                /**
                                 * isScheduledPermanent is a function that checks if the tutor set the specific time slot and day
                                 * as "Permanent", making it unavailable for the following weeks
                                 */
                                const isScheduledPermanent = tutorSessionsData?.schedule[0].permanent_indexes.some((index: any) => (
                                    index[0] == timeIndex && index[1] == dateIndex
                                ))

                                const hasPassed = date < currentDay

                                return (
                                    <React.Fragment key={dateIndex}>
                                        {isUnavailable || isScheduledPermanent || isScheduledTransient ? (
                                            <TableCell className="w-auto" key={dateIndex}>
                                                <div className="p-3  font-semibold text-maroon-900">
                                                    <p>Not Available</p>
                                                </div>
                                            </TableCell>
                                        ) : (
                                            <TableCell className="w-auto p-3" key={dateIndex}>
                                                <div>
                                                    {!hasPassed ? (
                                                        <RequestDialog currDate={date} Time={time} tutor_id={tutor_id} refreshFunction={() => router.refresh()} updateRequestDialog={isRequestDialogSubmitted}  />
                                                    ) : (
                                                        <Button className="bg-maroon" disabled>Request</Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}