"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, PersonIcon } from "@radix-ui/react-icons";




export type Sessions = {
    _id: string,
    tutor: {
        _id: string,
        university_number: string,
        name: string,
        program: string,
        username: string,
        email: string
    },
    student: {
        _id: string,
        university_number: string,
        name: string,
        program: string,
        username: string,
        email: string
    },
    course_code: string,
    course_name: string,
    description: string,
    date: any
    start_time: string,
    end_time: string,
    status: string,
    createdAt: any,
    updatedAt: any,
    __v: any
};

export const columns: ColumnDef<Sessions>[] = [
    {
        accessorKey: "tutor.name",
        header: () => <div className="flex items-center gap-2"> <PersonIcon /> Tutor</div>,
    },
    {
        accessorKey: "student.name",
        header: () => <div className="flex items-center gap-2"> <PersonIcon /> Student </div>,
        
    },
    {
        accessorKey: "course_code",
        header: "Course Code",
    },
    {
        accessorKey: "course_name",
        header: "Course Name",
    },
    {
        accessorKey: "date",
        header: () => <div className="flex items-center gap-2"> <CalendarIcon /> Date</div>,
        cell: ({ row }) => {
            const session = row.original

            return (
                <p>{session.date.replace(/T.*/, "")}</p>
            )
        },
    },
    {
        accessorKey: "start_time",
        header: () => <div className="flex items-center gap-2"> <ClockIcon /> Start Time </div>,
    },
    {
        accessorKey: "end_time",
        header: () => <div className="flex items-center gap-2"> <ClockIcon /> End Time </div>,
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
                <Badge className="bg-maroon">{sessionStatus}</Badge>
            )
        },
    },
];

