
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Session from "@/models/session.model";
import Feedback from "@/models/feedback.model";
import RecentFeedbacks from "./_components/RecentFeedbacks";
import mongoose from "mongoose";
import connect from "@/utils/db.config";
import { CalendarClockIcon } from "lucide-react";
const AlertProfile = dynamic(() => import("./_components/Alert"), { ssr: false }); // removes hydration error
const RecentRequests = dynamic(() => import("./_components/RecentRequests"), { ssr: false })

type DashboardData = {
    sessions: any,
    feedbacks: any
}

// test server actions
/**
 * 
 * @param tutorId
 * @returns Object containing Sessions and Feedbacks 
 */
async function getDashboardData(tutorId: string) {
    "use server";

    await connect();

    const sessions = await Session.aggregate([
        {
            $match: { tutor: new mongoose.Types.ObjectId(tutorId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "tutor",
                foreignField: "_id",
                as: "tutor"
            }
        },
        {
            $unwind: "$tutor"
        },
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "student"
            }
        },
        {
            $unwind: "$student"
        },
        { $sort: { date: 1 } },
    ]);

    const feedbacks = await Feedback.aggregate(
        [
            {
                $match: { reviewee: new mongoose.Types.ObjectId(tutorId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewer",
                    foreignField: "_id",
                    as: "reviewer"
                }
            },
            {
                $unwind: "$reviewer"
            },
        ]
    );

    return {
        sessions: sessions,
        feedbacks: feedbacks
    }
}

export default async function Dashboard() {

    const session: any = await getServerSession(authOptions);
    const open = !session?.user?.tags[0] || false;

    const user = session?.user;

    const dashbaordData: DashboardData = await getDashboardData(user._id);

    const sessions = dashbaordData.sessions;

    const upcoming_sessions = sessions.filter((session: any) => new Date(session.date) > new Date() && session.status == 'Accept');

    return (

        <div>
            <AlertProfile open={open} />

            <div className="flex flex-col p-6 md:gap-8 md:p-6">
                <div className="grid gap-2">


                    <div className="grid grid-cols-4 grid-rows-1 gap-4">
                        <div className="col-span-2">
                            <Card className="p-2 bg-gold-200 border-gold-500 shadow-sm text-maroon-900">
                                <CardHeader className="pb-4">

                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <Avatar className="md:size-20">
                                            <AvatarImage src={user.profile_picture} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div >
                                            <h2 className="font-bold text-xl">{user.name}</h2>
                                            <p className="text-maroon-500 dark:text-maroon-400">{user.program}</p>
                                            <div className="flex gap-1 pt-1">
                                                {user.tags.map((tag: any, index: number) => (
                                                    <Badge key={index} className="bg-gold-900 text-maroon hover:bg-gold-700">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="col-span-2 col-start-3">
                            <Card className="bg-gold-200 drop-shadow-sm border-gold-500 p-3">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-semibold text-maroon">
                                        Upcoming Sessions
                                    </CardTitle>
                                    <CalendarClockIcon className="h-4 w-4 text-maroon" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-maroon-900">{upcoming_sessions.length}</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-2">
                        <RecentRequests sessionsData={sessions} className="md:w-1/2" />
                        <RecentFeedbacks feedbacksData={dashbaordData.feedbacks} className="md:w-1/2" />
                    </div>

                </div>
            </div>
        </div>

    );
}
