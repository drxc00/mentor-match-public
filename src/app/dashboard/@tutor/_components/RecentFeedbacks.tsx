
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
  

export default async function RecentFeedbacks({ feedbacksData, className }: { feedbacksData: any, className: any }) {

    const feedbacks = feedbacksData


    return (
        <div className={className}>
            <Card className="h-full bg-gold-200 border-gold-500 shadow-sm text-maroon-900">
                <CardHeader>
                    <CardTitle>
                        <div className="flex gap-2 items-center">
                            <h1 className="font-bold text-xl items-center">Recent Feedbacks</h1>
                        </div>
                    </CardTitle>
                    <CardDescription>See what students are saying about you</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div>
                        <ScrollArea className=" h-[270px] ml-5 mr-5 rounded-md border p-4 bg-gold-muted">
                            {feedbacks.map((feedback: any, index: number) => (
                                <div key={index} className="mb-2">
                                    <div className="flex items-center gap-2 p-5 border rounded-xl bg-gold-200 border-gold-500 shadow-sm">
                                        <Avatar>
                                            <AvatarImage src={feedback.reviewer.profile_picture} />
                                            <AvatarFallback>{feedback.reviewer.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center">
                                                <div className="text-md font-semibold ">{feedback.reviewer.name}</div>
                                            </div>
                                            <div className="flex text-gold-900">
                                                {[...Array(feedback.rating)].map((_, index) => (
                                                    <StarFilledIcon key={index} />
                                                ))}
                                                {[...Array(5 - feedback.rating)].map((_, index) => (
                                                    <StarIcon key={index} />
                                                ))}
                                            </div>
                                            <div>
                                                <div className="text-sm ">{feedback.feedback}</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </CardContent>
                <CardFooter>
                    <></>
                </CardFooter>
            </Card>
        </div>

    )
}