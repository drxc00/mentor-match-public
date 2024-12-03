import User from "@/models/user.model";
import connect from "@/utils/db.config"
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache'

export const GET = async ( requests: any) => {
    /**
     * Retrieve All Users In the Database [Excluding admin]
     */
    revalidatePath(requests.url);
    try {
        await connect();

        const users = await User.find({ role: { $nin: "admin" } });

        if (!users) {
            return new NextResponse(JSON.stringify({ message: "No Users Found" }), { status: 400, headers: { 'Content-Type': 'application/json' }});
        } else {
            return new NextResponse(JSON.stringify({ message: users }), { status: 200, headers: { 'Content-Type': 'application/json' }});
        }
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: err }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

}   