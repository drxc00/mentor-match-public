"use client";

import { Button } from "@/components/ui/button";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@radix-ui/react-scroll-area";


type User = {
    _id: string;
    username: string;
    name: string;
    university_number: string;
    email: string;
    program: string;
    password: string;
    role: string;
    tags: any[]; // Assuming the type of tags can be any array
    profile_picture: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

type AdditionalFeedback = {
    _id: string;
    session: string;
    reviewer: User;
    reviewee: User;
    additional_feedback: string;
}

export const columns: ColumnDef<AdditionalFeedback>[] = [
    {
        accessorKey: "reviewer.name",
        header: "Reviewer"
    },
    {
        accessorKey: "reviewer.role",
        header: "Role",
        cell: ({ row }) => {
            const data = row.original;
            const role = data.reviewer.role;

            return (
                <Badge className="bg-gold-900 text-maroon">{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
            )
        }
    },
    {
        accessorKey: "additional_feedback",
        header: "Feedback Preview",
        cell: ({ row }) => {
            const feedback: string = row.getValue("additional_feedback")

            return (
                <div className="font-bold">
                    {feedback.slice(0, 10) + (feedback.length > 50 ? "..." : "")}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const feedback: string = row.getValue("additional_feedback");
            return (
                <Sheet>
                    <SheetTrigger className="underline font-semibold p-2">View</SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Feedback</SheetTitle>
                            <SheetDescription>
                                <ScrollArea className="bg-muted rounded-lg border min-w-[200px] max-h-[400px]">
                                    <div>
                                        <p>
                                            {feedback}
                                        </p>
                                    </div>
                                </ScrollArea>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

            )
        }
    }
]