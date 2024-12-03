import Conversation from "@/models/conversation.model"
import Message from "@/models/message.model"
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import { pusherServer } from "@/utils/pusher";


//send message function

// export const POST = async (
//         req: NextRequest,
//         res: any,
//         context: { params: { receiverId: string } }
//     ) => {

//URL in postman for testing:  http://localhost:3000/api/chat/sendMessage/<receiverId>

export async function POST(
    req: any
) {

    const { message, senderId, receiverId, conversationId, sessionId } = await req.json(); //passes value to body

    try {
        await connect();

        let conversation = await Conversation.findOne(
            {
                _id: conversationId
            }
        )

        const newMessage = new Message(
            {
                senderId,
                receiverId,
                message
            }
        )

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        await pusherServer.trigger(
            `sending_messages__session__${sessionId}`,
            "sent_new_message",
            {
                sessionId: sessionId,
            }
        )

        // idk if this works
        return new NextResponse(JSON.stringify({ message: "Message sent." }), { status: 200, headers: { 'Content-Type': 'application/json' } });


    } catch (error: any) {
        console.log("Error in sendMessage route: ", error.message)

        //idk this
        return new NextResponse(JSON.stringify({ message: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
