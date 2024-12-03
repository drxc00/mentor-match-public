"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import RequestDialog from "@/components/RequestDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "../loading";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type selectType = {
    index: number[],
    date: string,
    time: string[]
}
type Schedule = {
    _id: {
        $oid: string;
    };
    tutor: {
        $oid: string;
    };
    permanent_indexes: [
        [
            {
                $numberInt: number;
            },
            {
                $numberInt: number;
            }
        ]
    ];
    transient_dates: any[]; // Assuming transient_dates can be of any type
    createdAt: {
        $date: {
            $numberLong: string;
        };
    };
    updatedAt: {
        $date: {
            $numberLong: string;
        };
    };
    __v: {
        $numberInt: string;
    };
};

type SessionInformation = {
    result: [{
        _id: {
            $oid: string;
        };
        tutor: {
            $oid: string;
        };
        student: {
            $oid: string;
        };
        course_code: string;
        course_name: string;
        description: string;
        date: {
            $date: {
                $numberLong: string;
            };
        };
        start_time: string;
        end_time: string;
        status: string;
        duration_minutes: {
            $numberInt: string;
        };
        duration_seconds: {
            $numberInt: string;
        };
        chat_isActive: boolean;
        messages: any[]; // Assuming messages can be of any type
        feedbacks: {
            $oid: string;
        }[];
        createdAt: {
            $date: {
                $numberLong: string;
            };
        };
        updatedAt: {
            $date: {
                $numberLong: string;
            };
        };
        __v: {
            $numberInt: string;
        };
    }],
    schedule: [Schedule]
}

function SetAvailableBtn({ isScheduledTransient, isScheduledPermanent, scheduleId, indexes, date, time, refresh }:
    { isScheduledTransient: any, isScheduledPermanent: any, scheduleId: any, indexes: any[], date: string, time: any[], refresh: Function }) {
    const [hovered, setHovered] = useState(false);
    const { toast } = useToast();

    const removeSchedule = async () => {
        let postReq: any;

        if (isScheduledPermanent) {
            postReq = {
                scheduleId: scheduleId,
                xIndex: indexes[0],
                yIndex: indexes[1]
            }
        } else if (isScheduledTransient) {
            postReq = {
                scheduleId: scheduleId,
                date: new Date(date),
                start_time: time[0],
                end_time: time[1]
            }
        }

        const response = await fetch("/api/edit/schedule/", {
            method: "POST",
            body: JSON.stringify(postReq)
        });

        if (response.ok) {
            toast({
                title: "Schedule Updated"
            })
        }

        refresh();
    }
    return (

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button asChild className="bg-maroon-900 hover:bg-maroon-mono shadow-sm rounded-lg"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)} >
                    <div className=" p-3 text-gold border w-full h-full flex justify-center font-semibold">
                        {hovered ? (
                            <X size={20} />

                        ) : (
                            "Set as Unavailable"
                        )}
                    </div>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the date and time schedule as available.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={removeSchedule}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export default function ManageScheduleTable({ firstDay, lastDay, tutor_id, setSelectedIndex, selectedIndex, refresh }:
    { firstDay: string, lastDay: string, tutor_id: string, setSelectedIndex: any, selectedIndex: selectType, refresh: any }) {

    let dateOBJ = new Date(firstDay);

    const defaultSelected: selectType = {
        index: [-1, -1],
        date: "",
        time: ["", ""]
    }

    const router = useRouter();
    const [tutorSessionsData, setTutorSessionsData] = useState<SessionInformation>();

    const onDateTimeClick = (xIndex: number, yIndex: number, date: string, time: string[]) => {
        const selected_index: selectType = {
            index: [xIndex, yIndex],
            date: date,
            time: time
        };

        setSelectedIndex(selected_index);

    }

    const resetSelected = () => {
        setSelectedIndex(defaultSelected);
        // setSelected(defaultSelected)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const tutorSessionsResponse = await fetch("/api/data/sessions?" + new URLSearchParams({
                        tutor_id: tutor_id,
                        firstDay: firstDay,
                        lastDay: lastDay
                    }),
                    { method: 'GET', cache: "no-store" }
                );

                const data = await tutorSessionsResponse.json();

                console.log(data);
                setTutorSessionsData(data);

                // setDoRefresh(false);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();

    }, [firstDay, lastDay, tutor_id, refresh])

    /**
     * Current dates of the week, increments the dates onf th dateOBJ
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
        <div className="w-fit overflow-auto">
            <Table className=" rounded-xl bg-gold-muted border shadow-sm">
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
                                    session.start_time === time[0] && session.end_time === time[1]
                                ));


                                /**
                                 * isScheduledTransient checks if the current datetime is set as unavaile which is transient
                                 */
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

                                return (
                                    <React.Fragment key={dateIndex}>
                                        {isUnavailable && !isScheduledTransient && !isScheduledPermanent ? (
                                            <TableCell className="w-auto" key={dateIndex}>
                                                <div className="p-3 bg-gold-500 border shadow-sm rounded-lg font-semibold text-maroon-900">
                                                    <p>Scheduled</p>
                                                </div>
                                            </TableCell>
                                        ) : (
                                            <TableCell className="w-auto p-3" key={dateIndex}>
                                                {isScheduledTransient || isScheduledPermanent ? (
                                                    <SetAvailableBtn
                                                        isScheduledTransient={isScheduledTransient}
                                                        isScheduledPermanent={isScheduledPermanent}
                                                        scheduleId={tutorSessionsData?.schedule[0]._id}
                                                        indexes={[timeIndex, dateIndex]}
                                                        date={date}
                                                        time={time}
                                                        refresh={() => router.refresh()}
                                                    />
                                                ) : (
                                                    selectedIndex.index[0] == timeIndex && selectedIndex.index[1] == dateIndex ? (
                                                        <div className="h-10 p-3 bg-gold-700 hover:bg-gold-500 rounded-md" onClick={resetSelected}>
                                                            <p>Selected</p>
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 hover:bg-gold-700 rounded-md " onClick={() => onDateTimeClick(timeIndex, dateIndex, date, time)}></div>
                                                    )
                                                )}

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