"use client";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation"; // Import from next/router instead of next/navigation
import { CalendarIcon, DashboardIcon, PersonIcon} from "@radix-ui/react-icons";
import { ListIcon } from "lucide-react";
import Link from "next/link"; // Use Next.js's Link component
import { ListStart } from "lucide-react";

export default function SideBarItems({ session }: any) {

    const routerPath = usePathname();

    const isSelected = "flex flex-row gap-2 group items-center rounded-md px-3 py-2 text-sm font-medium bg-gold text-accent-foreground";
    const isNotSelected = "flex flex-row gap-2 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gold hover:text-accent-foreground";

    return (
        <nav className="grid items-start gap-2 text-gold-500">
            {session.user?.role === "admin" ? (
                <>
                    <Link href="/dashboard">
                        {routerPath == "/dashboard" ? (
                            <div className="flex flex-row gap-2 group items-center rounded-md px-3 py-2 text-sm font-medium bg-gold text-accent-foreground">
                                <DashboardIcon />
                                <span>Dashboard</span>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gold hover:text-accent-foreground">
                                <DashboardIcon />
                                <span>Dashboard</span>
                            </div>

                        )}

                    </Link>

                    <Link href="/dashboard/manage/users">
                        {routerPath == "/dashboard/manage/users" ? (
                            <div className="flex flex-row gap-2 group items-center rounded-md px-3 py-2 text-sm font-medium bg-gold text-accent-foreground">
                                <PersonIcon />
                                <span>Users</span>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gold hover:text-accent-foreground">
                                <PersonIcon />
                                <span>Users</span>
                            </div>
                        )}

                    </Link>

                    <Link href="/dashboard/manage/sessions">
                        {routerPath == "/dashboard/manage/sessions" ? (
                            <div className="flex flex-row gap-2 group items-center rounded-md px-3 py-2 text-sm font-medium bg-gold text-accent-foreground">
                                <DashboardIcon />
                                <span>Sessions</span>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gold hover:text-accent-foreground">
                                <DashboardIcon />
                                <span>Sessions</span>
                            </div>

                        )}

                    </Link>

                    <Link href="/dashboard/manage/feedbacks">
                        {routerPath == "/dashboard/manage/feedbacks" ? (
                            <div className="flex flex-row gap-2 group items-center rounded-md px-3 py-2 text-sm font-medium bg-gold text-accent-foreground">
                                <ListStart size={15} />
                                <span>Feedbacks</span>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gold hover:text-accent-foreground">
                                <ListStart size={15}/>
                                <span>Feedbacks</span>
                            </div>

                        )}

                    </Link>
                </>
            ) : (
                <>
                    <Link href="/dashboard">
                        <div className={routerPath == "/dashboard" ? (isSelected) : (isNotSelected)}>
                            <DashboardIcon />
                            <span>Dashboard</span>
                        </div>
                    </Link>
                    <Link href="/dashboard/tutor/my-schedule">
                        <div className={routerPath == "/dashboard/tutor/my-schedule" ? (isSelected) : (isNotSelected)}>
                            <CalendarIcon />
                            <span>My Schedule</span>
                        </div>
                    </Link>
                    <Link href="/dashboard/tutor/my-sessions">
                        <div className={routerPath == "/dashboard/tutor/my-sessions" ? (isSelected) : (isNotSelected)}>
                            <ListIcon size={15}/>
                            <span>My Sessions</span>
                        </div>
                    </Link>
                </>
            )}

        </nav>
    )
}