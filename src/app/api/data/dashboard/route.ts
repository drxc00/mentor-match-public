import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import User from "@/models/user.model";
import Session from "@/models/session.model";
import Feedback from "@/models/feedback.model";

export const GET = async (request: NextRequest) => {

    try {

        await connect();

        const users = await User.find({ role: { $nin: "admin" } }).sort({ createdAt: -1 });
        const sessions = await Session.aggregate([
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
            { $sort: { date: -1 } },
        ]);

        const feedbacks = await Feedback.aggregate(
            [
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
                {
                    $lookup: {
                        from: "users",
                        localField: "reviewee",
                        foreignField: "_id",
                        as: "reviewee"
                    }
                },
                {
                    $unwind: "$reviewee"
                },
                { $sort: { createdAt: 1 } },
            ]
        );

        return new NextResponse(JSON.stringify({ result: { users: users, sessions: sessions, feedbacks: feedbacks } }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Internal Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}