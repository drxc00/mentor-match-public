"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import ViewSessionButton from "@/components/ViewSessionBtn";

export type Session = {
    _id: string,
    student: {
        _id: string,
        university_number: string,
        name: string,
        program: string,
        username: string,
        email: string
    },
    tutor: {
        _id: string,
        university_number: string,
        name: string,
        program: string,
        username: string,
        email: string
    },
    date: string,
    start_time: string,
    end_time: string,
    status: string,
    course_code: string,
    course_name: string,

}

export const columns: ColumnDef<Session>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const session = row.original

            return (
                <>
                    {session.date.replace(/T.*/, "")}
                </>
            )
        },
    },
    {
        accessorKey: "tutor.name",
        header: "Tutor",
    },
    {
        accessorKey: "course_code",
        header: "Code",
    },
    {
        accessorKey: "course_name",
        header: "Course Name",
    },
    {
        accessorKey: "start_time",
        header: "Start",
    },
    {
        accessorKey: "end_time",
        header: "End",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {

            const session = row.original;
            let sessionStatus = session.status.charAt(0).toUpperCase() + session.status.slice(1);

            if (sessionStatus == "Conclude"){
                sessionStatus = "Concluded"
            }else{
                sessionStatus = sessionStatus + "ed";
            }


            return (
                <>
                    {session.status == "pending" ? (
                        <Badge className="bg-maroon">{session.status.charAt(0).toUpperCase() + session.status.slice(1)}</Badge>
                    ) : (
                        <Badge className="bg-maroon">{sessionStatus}</Badge>
                    )}
                </>
            )
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            const session = row.original
            return (
                session.status != "pending" ? (
                    <ViewSessionButton sessionId={session._id} disabled={false}/>
                ) : (
                    <ViewSessionButton sessionId={session._id} disabled={true}/>
                )
            )
        },
    }
]
