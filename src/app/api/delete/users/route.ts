import User from "@/models/user.model";
import connect from "@/utils/db.config";
import { NextResponse } from "next/server";

/**
 * Handles user deletion
 * @param request :any
 * @returns NextResponse
 */
export const POST = async (request: any) => {
    const { id }: any = await request.json();

    try {
        await connect();

        await User.findByIdAndDelete( { _id: id } );

        return new NextResponse(JSON.stringify({ message: "Delete Successful." }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: err }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }
}

