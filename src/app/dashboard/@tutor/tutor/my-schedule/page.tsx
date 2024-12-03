
import React, { Suspense } from "react";
import MyScheduleTable from "./components/MyScheduleTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MySchedulePagination from "./components/MySchedulePagination";
import Loading from "./loading";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function MySchedulePage() {

    const session: any = await getServerSession(authOptions);

    const tutorId = session.user._id;

    return (
        <div className="w-full p-5">
            <div className="flex space-y-2  p-2 md:p-1 pt-6">
                <div className=" flex flex-col py-2 w-full p-4">
                    <div className="flex items-start">
                        <div>
                            <div>
                                <Breadcrumb className="py-2">
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/dashboard/tutor/my-schedule">My Schedule</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Schedule</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-maroon">My Schedule</h2>
                                    <p className="text-sm text-muted-foreground">Manage your schedule</p>
                                </div>
                                <div>
                                    <Button asChild className="bg-maroon hover:bg-maroon-700">
                                        <Link href="/dashboard/tutor/my-schedule/manage">
                                            Manage Schedule
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <MySchedulePagination tutorId={tutorId} />
                </div>
            </div>
        </div>
    );
}