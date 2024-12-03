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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { link } from "fs";
import Link from "next/link";


export type Feedback = {
    _id: String;
    session: String;
    reviewer: {
        _id: String;
        username: string;
        name: string;
        university_number: string;
        email: string;
        program: string;
        password: string;
        role: string;
        tags: string[];
        profile_picture: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    };
    reviewee: {
        _id: String;
        username: string;
        name: string;
        university_number: string;
        email: string;
        program: string;
        password: string;
        role: string;
        tags: string[];
        profile_picture: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    };
    rating: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export const columns: ColumnDef<Feedback>[] = [
    {
        accessorKey: "session",
        header: "Session ID"
    },
    {
        accessorKey: "reviewee.name",
        header: "Reviewee"
    },
    {
        accessorKey: "reviewee.role",
        header: "Role",
        cell: ({ row }) => {
            const data = row.original;
            const role = data.reviewee.role;

            return (
                <Badge className="bg-gold-900 text-maroon">{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
            )
        }
    },
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
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = parseInt(row.getValue("rating"))
            const filledStars = Array.from({ length: rating }, (_, index) => index)
            const unFilledStars = Array.from({ length: (5 - rating) }, (_, index) => index)
            return (
                <span className="text-sm text-gold-900">
                    <div className="flex gap-1">
                        {filledStars.map(index => (
                            <StarFilledIcon key={index} />
                        ))}

                        {unFilledStars.map(index => (
                            <StarIcon key={index} />
                        ))}
                    </div>
                </span>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "feedback",
        header: "Feedback Preview",
        cell: ({ row }) => {
            const feedback: string = row.getValue("feedback")

            return (
                <div className="font-bold">
                    {feedback.slice(0, 10) + (feedback.length > 10 ? "..." : "")}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const feedback: any = row.original;
            return (
                <Sheet>
                    <SheetTrigger className="underline font-semibold p-2">View</SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Feedback</SheetTitle>
                            <SheetDescription>
                                <div className="flex items-center gap-2 mb-5">
                                    <Avatar>
                                        <AvatarImage src={feedback.reviewer.profile_picture} />
                                        <AvatarFallback>{feedback.reviewer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="mt-5">
                                        <div className="flex items-center">
                                            <div className="text-md font-semibold ">{feedback.reviewer.name}</div>
                                        </div>
                                        <div>

                                            <div className="flex text-gold-900 mb-2 text-xl">
                                                {[...Array(feedback.rating)].map((_, index) => (
                                                    <StarFilledIcon key={index} />
                                                ))}
                                                {[...Array(5 - feedback.rating)].map((_, index) => (
                                                    <StarIcon key={index} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div>
                                    <ScrollArea className="p-5 min-w-[200px] min-h-[300px] bg-muted border rounded-sm">
                                        <div className="text-sm ">{feedback.feedback}</div>
                                    </ScrollArea>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

            )
        }
    }
]