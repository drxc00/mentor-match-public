import Conversation from "@/models/conversation.model"
import Message from "@/models/message.model";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose from "mongoose";

export async function GET(
        req: NextRequest
      ) {

        /**
         * parse conversationId from get requests
         * ! WARNING: this line assumes that the get request always contains a conversationId parameter.
         */
        const conversationId: string = req.nextUrl.searchParams.get("conversationId")!;
    
    try 
    {
        
        await connect();

        const chosenConversation = await Conversation.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(conversationId)}},
            {
                        $lookup: {
                            from: "messages",
                            let: { messages: "$messages" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ['$_id', "$$messages"]
                                        }
                                    }
                                }
                            ],
                            as: "messages"
                        }
                    },])

        if(!chosenConversation){
        //return NextResponse.json([]);
        console.log("no conversation found");
        return new NextResponse(JSON.stringify("no messages"));
        }

            const messageArray =  chosenConversation[0].messages; 

            //console.log("messageArray 1: ", messageArray);

            return new NextResponse(JSON.stringify({ messageArray }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });

            //for testing
            // if(conversationId==null)
            // {
            //     return new NextResponse(JSON.stringify( "no conversationid found" ));
            // }else{
            //     return new NextResponse(JSON.stringify( {conversationId} ));
            // }
            
    } catch (error) 
    {
        console.log("Error in getMessages route: ", error) 
        // return NextResponse.json(
        //     { message: error }, 
        //     { status: 500, headers: { 'Content-Type': 'application/json' }}
        //     ); //idk what this does

        return new NextResponse(JSON.stringify("error in getMessages route"));

    }
}

