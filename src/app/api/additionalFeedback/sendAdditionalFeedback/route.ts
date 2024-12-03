//para malagay ung add_feedback sa db
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose from "mongoose";
import Session from "../../../../models/session.model";
import AddFeedback from "../../../../models/additionalFeedback.model"
import { pusherServer } from "@/utils/pusher";


export const POST = async (req:NextRequest) => {
    const { session, reviewer, reviewee, additional_feedback } = await req.json ();
    try {
        await connect();

        let addFeedback = await AddFeedback.findOne()

            if(!addFeedback)
            {
                addFeedback = await AddFeedback.create()
            }

        const newAddFeedback = new AddFeedback(
            {
                session,
                reviewer,
                reviewee,
                additional_feedback
            }
        )
        // if(newAddFeedback)
        // {
        //     addFeedback.push(newAddFeedback._id);
        // }

        // await Promise.all([addFeedback.save()]);
        await newAddFeedback.save();

        const fetchSession = await Session.findById({ _id: session });
        fetchSession.additionalFeedback.push(newAddFeedback._id);
        fetchSession.save();

        // pusherServer.trigger(
        //     `sending_messages`, 
        //     "sent_new_message", 
        //     {
        //         session: session,
        //         reviewer: reviewer,
        //         reviewee: reviewee,
        //         additional_feedback: additional_feedback
        //     }
        // )
        return new NextResponse(JSON.stringify({ additional_feedback: "addFeedback created" }));

    } catch (error) {
        console.log("Error in sendAdditionalFeedback route: ", error) 
        // return NextResponse.json(
        //     { message: error }, 
        //     { status: 500, headers: { 'Content-Type': 'application/json' }}
        //     ); //idk what this does

        return new NextResponse(JSON.stringify("Error in sendAdditionalFeedback route"));

    }
}