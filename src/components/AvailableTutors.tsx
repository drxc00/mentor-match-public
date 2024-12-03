"use client";

import { Button } from "@/components/ui/button";
import {
    Card
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "./ui/use-toast";
import { useState } from "react";
import RequestDialog from "./RequestDialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function AvailableTutors({ tutors, sessionDate, topic, startTime, endTime }: any) {

    const { data: session, status }: any = useSession();
    const [requestedTutors, setRequestedTutors] = useState<string[]>([]);;
    const [isRequested, setIsRequested] = useState<Boolean>(false);
    const router = useRouter();

    // convert sessionDate to ISO string
    const date = new Date(sessionDate);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for time zone offset
    const isoString = date.toISOString();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session || !session.user) {
        router.push("/login");
    }

    return (
        <>
            <ScrollArea className="h-[325px] w-full p-4 space-y-2">
                {tutors.map((tutor: any) => (
                    <Card key={tutor._id} className="w-auto  hover:scale-100 transition-all shadow-lg">
                        <div className="flex gap-2 items-center justify-between">
                            <div className="flex p-4 text-left">
                                <Avatar className="">
                                    <AvatarImage src={tutor.profile_picture} />
                                    <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <h3 className="text-l font-bold">{tutor.name}</h3>
                                    <div className="flex gap-2">
                                        {tutor.tags.map((tag: any, index: number) => (
                                            <Badge key={index} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className=" p-3">
                                {!isRequested ? (
                                    <RequestDialog
                                        tutor_id={tutor._id}
                                        currDate={isoString}
                                        Time={[startTime, endTime]}
                                        refreshFunction={() => setIsRequested(true)}
                                        updateRequestDialog={null}
                                    />
                                ) : (
                                    <Button variant="secondary" disabled> Requested </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </ScrollArea>

        </>
    );
}