
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersRoundIcon } from "lucide-react";
import { UserIcon } from "lucide-react";
import { Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock4Icon } from "lucide-react";
import { LucideBookMarked } from "lucide-react";

export default async function RecentRequests({ sessionsData, className }: { sessionsData: any, className: any }) {
    const _allRecentRequests = sessionsData.filter((session: any) => session.status == "pending");
    const recentRequests = sessionsData.filter((session: any, index: number) => {
        return session.status === "pending";
    }).slice(0, 5);

    return (
        <div className={className}>
            <Card className="bg-gold-200 border-gold-500 shadow-sm text-maroon-900">
                <CardHeader>
                    <CardTitle>
                        <div className="flex gap-2 items-center">
                            <h1 className="font-bold text-xl items-center">Recent Requests</h1>
                            <Badge>{recentRequests.length}</Badge>
                        </div>
                    </CardTitle>
                    <CardDescription className="text-maroon">Students that requested for your tutoring service</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div>
                        <ScrollArea className=" h-[270px] ml-5 mr-5 rounded-md border p-4 bg-gold-muted text-maroon-900">
                            {recentRequests.map((request: any, index: number) => (
                                <div key={index}>
                                    <div className=" items-center flex flex-wrap p-5 lg:space-x-9 border rounded-xl mb-2 bg-gold-200 border-gold-500 shadow-sm">
                                        <div className="grid grid-cols-1 justify-between space-y-2">
                                            <div className="text-sm flex gap-2 items-center"><UserIcon size={20} /> {request.student.name}</div>
                                            <div className="text-sm flex gap-2 items-center"> <Calendar size={20} /> {new Date(request.date).toISOString().replace(/T.*/, '')}</div>
                                        </div>
                                        <div className="grid grid-cols-1 justify-between space-y-2">
                                            <div className="text-sm flex gap-2 items-center"> <Clock4Icon size={20} /> {request.start_time} - {request.end_time}</div>
                                            <div className="text-sm flex gap-2 items-center"> <LucideBookMarked size={20} /> {request.course_code}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </CardContent>
                <CardFooter>
                    <CardDescription>
                        <div className="mt-2">
                            Showing {recentRequests.length} of {_allRecentRequests.length}
                        </div>
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>

    )
}