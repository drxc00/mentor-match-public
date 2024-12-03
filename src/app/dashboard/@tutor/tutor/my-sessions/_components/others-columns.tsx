"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import Link from "next/link";

export type Session = {
    _id: string;
    student: {
        _id: string;
        university_number: string;
        name: string;
        program: string;
        username: string;
        email: string;
    };
    tutor: {
        _id: string;
        university_number: string;
        name: string;
        program: string;
        username: string;
        email: string;
    };
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    course_code: string;
    course_name: string;
};


import { Badge } from "@/components/ui/badge";


export const others_columns: ColumnDef<Session>[] = [
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
            );
        },
        cell: ({ row }) => {
            const session = row.original;

            return <>{session.date.replace(/T.*/, "")}</>;
        },
    },
    {
        accessorKey: "student.name",
        header: "Student's Name",
    },
    {
        accessorKey: "student.email",
        header: "Student's Email",
    },
    {
        accessorKey: "student.program",
        header: "Program",
    },
    {
        accessorKey: "start_time",
        header: "Start Time",
    },
    {
        accessorKey: "end_time",
        header: "End Time",
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
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => {
            const session = row.original;
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href={`/sessions/${session._id}`}>View</Link>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
];
