import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose from "mongoose";
import Feedback from "@/models/feedback.model";

export const POST = async (req: any, res: any) => {

    const { student, tutor, session, feedback, additional_feedback }: any = await req.json();

    try {
        await connect();

        const existingFeedback = await Feedback.findOne({ session: session });

        if (existingFeedback) {
            // existing feedback
            existingFeedback.feedback = feedback;
            existingFeedback.additional_feedback = additional_feedback;
            await existingFeedback.save();

            return new NextResponse(JSON.stringify({ existingFeedback: existingFeedback.toObject() }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            // new feedback
            const newFeedback = new Feedback({
                student,
                tutor,
                session,
                feedback,
                additional_feedback,
            });
            await newFeedback.save();

            return new NextResponse(JSON.stringify({ newFeedback: newFeedback.toObject() }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify({ error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};