"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookA, CheckCircle, FileClock, NotebookPen, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "@/components/ui/label";
import SessionTimer from "./SessionTimer";
import { PersonIcon, ClockIcon, CalendarIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";



export default function SessionInformation({ sessionInformation }: any) {

    const session = sessionInformation;


    const { data: sessionData, status }: any = useSession();

    if (!sessionData) {
        return null;
    }

    const userRole: any = sessionData?.user?.role;


    if (!userRole) {
        return null;
    }

    const isStudent = userRole === "student";

    let sessionStatus = session.status;

    if (sessionStatus.endsWith("de")) {
        sessionStatus = sessionStatus + "d";
    } else {
        sessionStatus = sessionStatus + "ed";
    }

    return (
        <>
            <Card className=" bg-gold border-none">
                <CardHeader>
                    <div className="flex justify-between flex-wrap">
                        <div>
                            <CardTitle className="text-3xl text-maroon-mono flex items-center">
                                <FileClock className="mr-2 text-maroon-mono" />
                                Session Information
                            </CardTitle>
                            <CardDescription className="text-black">Details about the tutoring session.</CardDescription>
                        </div>

                        <div className="flex gap-2 items-center bg-gold-200 border rounded-xl pl-2 pr-2 p-5">
                            {session.status === "Accept" && <CheckCircle className="w-6 h-6 text-green-500" />}
                            {session.status === "Decline" && <XCircle className="w-6 h-6 text-red-500" />}
                            {session.status === "Conclude" && <ClockIcon className="w-6 h-6 text-yellow-500" />}
                            <p className="text-md font-semibold text-maroon">Status:</p>
                            <Badge className="bg-gold-700 text-maroon-900">
                                {sessionStatus}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <Card className="bg-gold-200">
                            <CardContent className="p-4 space-y-2">
                                <div className=" flex flex-wrap space-x-9 justify-center">
                                    <div className="flex flex-row lg:items-center  gap-3">
                                        <PersonIcon className="size-7 bg-gold-muted  border rounded p-1" />
                                        <div>
                                            <Label className="text-sm font-bold peer-disabled:font-medium" htmlFor="tutee">
                                                {isStudent ? (<>Tutor</>) : (<>Tutee</>)}
                                            </Label>
                                            <p className="text-sm">{isStudent ? (<>{session.tutor.name}</>) : (<>{session.student.name}</>)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <ClockIcon className="size-7 bg-gold-muted border rounded p-1" />
                                        <div>
                                            <Label className="text-sm font-bold peer-disabled:font-medium" htmlFor="time">
                                                Time
                                            </Label>
                                            <p className="text-sm">{session.start_time} - {session.end_time}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <CalendarIcon className="size-7 bg-gold-muted border  rounded p-1" />
                                        <div>
                                            <Label className="text-sm font-bold peer-disabled:font-medium" htmlFor="date">
                                                Date
                                            </Label>
                                            <p className="text-sm">{new Date(session.date).toISOString().replace(/T.*/, "")}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <BookA className="size-7 bg-gold-muted border rounded p-1" />
                                        <div className="">
                                            <Label className="text-sm font-bold peer-disabled:font-medium" htmlFor="subject">
                                                Subject
                                            </Label>
                                            <div className="flex gap-2 ">
                                                <p className="text-sm">{session.course_name} ({session.course_code})</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid lg:grid-cols-4 md:grid-rows-1">
                            <div className="lg:col-span-3 md:row-span-1"> 
                                <Card className="mt-2 w-full bg-gold-200">
                                    <CardContent className="flex flex-col p-5 space-y-2">
                                        <div className="flex flex-row justify-between">
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-2">
                                                <InfoCircledIcon className="size-7 bg-gold-muted  border rounded p-1" />
                                                <Label className="text-sm font-bold peer-disabled:font-medium" htmlFor="concern">
                                                    {`${isStudent ? "Your" : "Student"} Concern`}
                                                </Label>
                                            </div>

                                            <ScrollArea className="h-[200px] w-auto rounded-md border p-4 bg-gold-muted">
                                                {session.description}
                                            </ScrollArea>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1 md:row-span-1">
                                <SessionTimer
                                    sessionId={session._id}
                                    actualDurationMinutes={session.duration_minutes}
                                    actualDurationSeconds={session.duration_seconds}
                                    disabled={session.status == "Conclude" || session.status == "Cancel"}
                                    isStudent={isStudent}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}