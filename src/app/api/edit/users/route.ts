import User from "@/models/user.model";
import Schedule from "@/models/schedule.model";
import mongoose from "mongoose";
import connect from "@/utils/db.config"
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
    const {
        id,
        username,
        name,
        program,
        university_number,
        email,
        password,
        role
    }: any = await request.json();

    /**
     * init connection
     */

    try {
        await connect();

        /**
         * Update user
         */
        await User.updateOne({ _id: id }, {
            username: username,
            name: name,
            program: program,
            university_number: university_number,
            email: email,
            password: password,
            role: role
        });

        if(role == 'tutor') {
            const newSchedule = new Schedule({
                tutor: new mongoose.Types.ObjectId(id),
                permanent_indexes: [],
                transient_dates: []
            });

            await newSchedule.save();
        }

        return new NextResponse(JSON.stringify({ message: "Edit Successful." }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: err }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

}