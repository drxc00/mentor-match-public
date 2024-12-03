"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const ActionsComp = ({ row }: any) => {
  const router = useRouter();

  return (
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
        <DropdownMenuItem onClick={() => actionHandler(row, router, "Accept")}>Accept</DropdownMenuItem>
        <DropdownMenuItem onClick={() => actionHandler(row, router, "Reject")}>Reject</DropdownMenuItem>
        <DropdownMenuItem onClick={() => actionHandler(row, router, "Cancel")}>Cancel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function actionHandler(row: any, router: any, action: string) {
  try {
    const sessionId = row.original._id;

    const status: string = action;

    const result = await fetch("/api/edit/sessions/", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        _id: sessionId,
        status: status,
      })
    });
    if (result.ok) {
      const data = await result.json();
      console.log(data);
      router.refresh();
    } else {
      console.error("Error updating session status:", result.statusText);
    }
  } catch (error) {
    console.error("Error updating session status:", error);
  }
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

      return (
        <>
          {session.status == "pending" ? (
            <Badge className="bg-maroon">{session.status.charAt(0).toUpperCase() + session.status.slice(1)}</Badge>
          ) : (
            <Badge className="bg-maroon">{session.status.charAt(0).toUpperCase() + session.status.slice(1)}</Badge>
          )}
        </>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <ActionsComp row={row} />
      )
    },
  },
];
