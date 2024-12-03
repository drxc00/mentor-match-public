import { NextResponse, NextRequest } from "next/server";
import Session from "@/models/session.model";
import connect from "@/utils/db.config";
import Feedback from "@/models/feedback.model";
import mongoose from "mongoose";


export const POST = async (request: NextRequest) => {
    try {
        const { session, reviewer, reviewee, feedback, rating } = await request.json();

        await connect();

        const newFeedback = new Feedback(
            {
                session: new mongoose.Types.ObjectId(session),
                reviewer: new mongoose.Types.ObjectId(reviewer),
                reviewee: new mongoose.Types.ObjectId(reviewee),
                feedback: feedback,
                rating: rating,
            }
        )

        await newFeedback.save();

        /**
         * push new review to session
         */

        const fetchSession = await Session.findById({ _id: session });
        fetchSession.feedbacks.push(newFeedback);
        fetchSession.save();


        return new NextResponse(
            JSON.stringify({ message: "Feedback Sent" }),
            { status: 200 }
        )


    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }

}

export const GET = async (request: NextRequest) => {

    const tutorId: any = request.nextUrl.searchParams.get("tutorId");

    try {

        await connect();

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

        return new NextResponse(
            JSON.stringify({ feedbacks: feedbacks }),
            { status: 200 }
        )

    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }

}