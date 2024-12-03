//para sa dropdown
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose from "mongoose";
import Sessions from "../../../../models/session.model";

export const POST = async (req:NextRequest) => {
    const { sessionId } = await req.json ();
    try {
        await connect();
        const session = await Sessions.findById(
            {
                _id: sessionId
            },
        );

        const tutorId = session.tutor;

        // const concludedSessions = session.filter(session => session.status == "Conclude");

        // if (concludedSessions == null) {
        //     return new NextResponse(JSON.stringify("No Concluded sessions"));
        // }

        return new NextResponse(JSON.stringify({tutorId}));

    } catch (error) {
        console.log("Error in getConcluded route: ", error) 
        // return NextResponse.json(
        //     { message: error }, 
        //     { status: 500, headers: { 'Content-Type': 'application/json' }}
        //     ); //idk what this does

        return new NextResponse(JSON.stringify("Error in getConcluded route"));

    }
}