import Message from "@/models/message.model";
import Session from "@/models/session.model";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose from "mongoose";
import { pusherServer } from "@/utils/pusher";

/**
 * 
 * POST request route for sending message
 * 
 */

export const POST = async (request: NextRequest) => {
    try {
        const { sessionId, sender, message } = await request.json();

        await connect();

        // add new message to database
        const newMessage = new Message({
            sender: new mongoose.Types.ObjectId(sender),
            message: message
        });

        await newMessage.save();

        // add new message to session messages array

        pusherServer.trigger(
            `sending_messages`, 
            "sent_new_message", 
            {
                sender: sender,
                message: message
            }
        )


        const session = await Session.findById(
            {
                _id: sessionId
            },
        );

        session.messages.push(newMessage);
        session.save();

        return new NextResponse(
            JSON.stringify({ message: "Message Added Successful!" }),
            { status: 200 }
        );

    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}