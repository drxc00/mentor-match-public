
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ChatBox from "./_components/ChatBox";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import SessionInformation from "./_components/SessionInformation";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import FeedBackForm from "./_components/FeedBackForm";
import Feedback from "./_components/FeedBack";
import FeedBackContainer from "./_components/FeedBackContainer";
import Session from "@/models/session.model";
import connect from "@/utils/db.config";
import mongoose from "mongoose";


/**
 * USING SERVER ACTIONS
 * @param sessionId 
 * @returns object regarding the session
 */
async function getSessionData(sessionId: string) {
    "use server";
    
    await connect();

    return await Session.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(sessionId) }
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
        {
            $lookup: {
                from: "feedbacks",
                let: { feedbacks: "$feedbacks" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ['$_id', "$$feedbacks"]
                            }
                        }
                    }
                ],
                as: "feedbacks"
            }
        }
    ]);
}

export default async function SessionPage({ params }: {
    params: { sessionId: string }
}) {

    const sessionId = params.sessionId;
    const sessionData: any = await getServerSession(authOptions);

    if (!sessionData) {
        redirect("/login");
    }

    const isStudent = sessionData.user.role == "student";

    const sessionInformation: any = await getSessionData(sessionId);

    //for checking and getting the other user Id
    const session = JSON.parse(JSON.stringify(sessionInformation[0]))
    const loggedInUser = sessionData.user._id;
    var otherUserId = session.tutor._id;

    const conversation = session.conversation;

    if(loggedInUser==otherUserId) //bano ang nag-code nito
        {
            otherUserId = session.student._id
        }

    const feedbacks = session.feedbacks;
    /**
     * * Checks if the feedbacks array in the session is empty or not
     * * if the array is not empty, it checks the array if there is an instance of
     * * the current user in the session and that the user is the  "reviewee"
     */
    const isThereFeedback = feedbacks.length != 0 && feedbacks.some((feedback: any) => feedback.reviewer == sessionData.user._id);

    const yourFeedback = feedbacks?.filter((feedback: any) => feedback.reviewer == sessionData.user._id)[0];

    return (
        <main>
            <div className="flex flex-wrap mt-20 items-center lg:pr-3">
                <div className="flex-1">
                    <SessionInformation sessionInformation={session} />
                </div>
                <div className="md:justify-center lg:w-auto lg:ml-0 w-full pr-5 pl-5 lg:p-0">
                    <ChatBox
                        sessionId={sessionId}
                        userId={sessionData.user._id}
                        conversationId={conversation}
                        sessionConcluded={session.status == "Conclude" || session.status == "Cancel"}
                        isStudent={isStudent}
                        isChatActive={session.chat_isActive}
                        otherUserId={otherUserId}
                    />
                </div>
            </div>
            {session.status == "Conclude" ? (
                <>
                    <Separator className="container" />
                    <div>
                        <FeedBackContainer
                            isStudent={isStudent}
                            sessionInformation={session}
                            yourFeedback={yourFeedback}
                            isThereFeedback={isThereFeedback}
                        />
                    </div>
                </>
            ) : (
                <></>
            )}

        </main>
    );
}