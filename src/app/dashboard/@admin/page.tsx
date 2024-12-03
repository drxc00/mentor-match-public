
import React from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, CalendarClockIcon, DollarSign, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

export default async function Admin() {

    const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;


    console.log(url);

    const response = await fetch(url + "/api/data/dashboard", { method: 'GET', cache: "no-store" });
    const data = await response.json();
    const dashboardData = data.result;

    // for date manipulation
    const localTimezoneDate = new Date(); // get local timezone
    localTimezoneDate.setTime(localTimezoneDate.getTime() + (8 * 60 * 60 * 1000));
    const _date = new Date();

    const __firstDay = new Date(new Date(localTimezoneDate));

    __firstDay.setTime(__firstDay.getTime() + (8 * 60 * 60 * 1000)); // philippines gmt
    __firstDay.setDate(__firstDay.getDate() - __firstDay.getDay() + 1); // Set to the first day of the week

    const firstDay = new Date();
    firstDay.setTime(__firstDay.getTime() + (8 * 60 * 60 * 1000));
    firstDay.setHours(0, 0, 0, 0);
    // users
    const users = dashboardData.users;
    const recent_users = users.filter((user: any) => {
        const createdAt = new Date(user.createdAt);
        // console.log("Creation: " + createdAt + " " + "FirstDay: " + firstDay + " " + "Is within the week?: " + (createdAt >= firstDay))
        return createdAt >= firstDay // if the user is created within the week
    });

    // sessions
    const sessions = dashboardData.sessions;

    // filters upcoming sessions based on the current week
    const upcoming_sessions = sessions.filter((session: any) => {
        const session_date = new Date(session.date);

        // console.log("Session: " + session_date + " " + "FirstDay: " + firstDay + " " + "Is within the week?: " + (session_date >= firstDay))
        return session.status == "Accept" && session_date >= firstDay;
    });

    // TODO: make this recent
    let concluded_session_counter: number = 0;
    const recent_sessions = sessions.filter((session: any, index: number) => {
        if (session.status == "Conclude" && concluded_session_counter < 5) {
            concluded_session_counter++;
            return true;
        }
        return false;

    })

    // feedbacks
    const feedbacks = dashboardData.feedbacks;

    return (
        <main className="flex flex-col gap-4 p-2 md:gap-2 md:p-8">
            <div className="grid gap-4 md:grid-cols-1 md:gap-2 lg:grid-cols-2">
                <Card className="bg-gold-200 drop-shadow-sm border-gold-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-maroon">
                            Active Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-maroon" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-maroon-900">{users.length}</div>
                        <p className="text-xs text-maroon-muted">
                            +{recent_users.length} from the last 7 days
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gold-200 drop-shadow-sm border-gold-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-maroon">
                            Upcoming Sessions
                        </CardTitle>
                        <CalendarClockIcon className="h-4 w-4 text-maroon" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-maroon-900">{upcoming_sessions.length}</div>
                        <p className="text-xs text-maroon-muted">
                            +{upcoming_sessions.length} from the last 7 days
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:gap-2 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2 bg-gold-200 drop-shadow-sm border-gold-500">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle className="font-semibold text-maroon">Sessions</CardTitle>
                            <CardDescription className="text-maroon-muted">
                                Recent sessions from from Mentor Match.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1 bg-maroon-mono hover:bg-maroon-900">
                            <Link href="/dashboard/manage/sessions">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden sm:table-cell text-maroon">Date</TableHead>
                                    <TableHead className="hidden sm:table-cell text-maroon">
                                        Time
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell text-maroon">
                                        Tutor
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell text-maroon">
                                        Tutee
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell text-maroon">Duration</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-maroon">
                                {recent_sessions.map((session: any, index: number) => (
                                    <TableRow key={index} className="bg-gold-muted">
                                        <TableCell className="p-4">
                                            <div className="font-medium">
                                                <Badge variant="outline" className="border-gold-500 bg-gold-200">
                                                    {session.date.replace(/T.*/, '')}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {session.start_time} - {session.end_time}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {session.tutor.name}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {session.student.name}
                                        </TableCell>
                                        <TableCell className="text-left">
                                            {session.duration_minutes < 10 ? `0${session.duration_minutes}` : session.duration_minutes}
                                            :
                                            {session.duration_seconds < 10 ? `0${session.duration_seconds}` : session.duration_seconds}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="bg-gold-200 drop-shadow-sm border-gold-500 text-maroon">
                    <CardHeader>
                        <CardTitle>Recent Feedbacks</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        <ScrollArea className="h-[350px] bg-gold-muted p-5 border rounded-md">
                            {feedbacks.map((feedback: any, index: number) => {
                                const filledStars = Array.from({ length: feedback.rating }, (_, index) => index)
                                const unFilledStars = Array.from({ length: (5 - feedback.rating) }, (_, index) => index)

                                return (
                                    <div className="flex flex-col gap-4 border p-5 mt-2 rounded-xl bg-gold-200 border-gold-500" key={index}>
                                        <div className="flex items-center">
                                            <div className="flex gap-3">
                                                <Avatar className="hidden h-9 w-9 sm:flex">
                                                    <AvatarImage src={feedback.reviewer.profile_picture} alt="Avatar" />
                                                    <AvatarFallback>{feedback.reviewer.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="grid gap-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {feedback.reviewer.name}
                                                    </p>
                                                    <div className="flex gap-2">

                                                        <p className="text-xs text-muted-foreground">
                                                            Reviewing: {feedback.reviewee.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-auto font-medium">
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
                                            </div>
                                        </div>
                                        <div>
                                            <ScrollArea className="h-[60px] bg-gold-muted border rounded p-2 text-sm">
                                                {feedback.feedback}
                                            </ScrollArea>

                                        </div>

                                    </div>
                                )
                            })}

                        </ScrollArea>

                    </CardContent>
                </Card>
            </div>
        </main>
    );
}