"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditDialogComp from "./_components/EditDialog";
import TrashButton from "./_components/TrashButton";


export type User = {
    _id: string,
    username: string,
    university_number: string,
    email: string,
    program: string,
    password: string,
    role: string,
    tags: string[],
    createdAt: any,
    updatedAt: any,
    __v: any
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "university_number",
        header: "Student Number",
        cell: ({ row }) => {
            const user = row.original

            return (
                <Badge variant="secondary">{user.university_number}</Badge>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant={"ghost"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 pr-0"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const user = row.original

            return (
                <Badge className="bg-gold-900 text-maroon" >{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "program",
        header: "Program",
    },
    {
        accessorKey: "edit",
        header: "Edit",
        id: "edit",
        cell: ({ row }) => {
            const user = row.original

            return (
                <EditDialogComp user={user} />
            )
        },
    },
    {
        accessorKey: "delete",
        header: "Delete",
        id: "delete",
        cell: ({ row }) => {
            const user = row.original
            return (
                <TrashButton id={user._id} />
            )
        },
    },
];

