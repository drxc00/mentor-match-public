import User from "@/models/user.model";
import Schedule from "@/models/schedule.model";
import mongoose from "mongoose";
import connect from "@/utils/db.config"
import { NextResponse } from "next/server";

const bcryptjs = require("bcryptjs");

export const POST = async (request: any) => {



    try {
        const {
            username,
            name,
            university_number,
            email,
            program,
            password,
            role,
            tags } = await request.json();

        if (!username || !name || !university_number || !email || !program || 
            !password || !role ) {
                return new NextResponse(JSON.stringify({ message: "Internal Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }

        await connect();

        //validation checks
        const isLoginExist = await User.findOne({ username: username });
        const isEmailExist = await User.findOne({ email: email });
        const isNumberExist = await User.findOne({ university_number: university_number });

        // checks if login name, email, and university number used
        if (isLoginExist) {
            return new NextResponse(JSON.stringify({ message: "Login name already used." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        } else if (isEmailExist) {
            return new NextResponse(JSON.stringify({ message: "Email already used." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        } else if (isNumberExist) {
            return new NextResponse(JSON.stringify({ message: "University number already used." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        try {
            const newUser = new User({
                username: username,
                name: name,
                university_number: university_number,
                email: email,
                program: program,
                password: password,
                role: role,
                tags: tags,
                profile_picture: ""
            });

            await newUser.save();


            if (newUser.role == 'tutor') {
                const newSchedule = new Schedule({
                    tutor: new mongoose.Types.ObjectId(newUser._id),
                    permanent_indexes: [],
                    transient_dates: []
                });

                await newSchedule.save();
            }

            return new NextResponse(JSON.stringify({ message: "Account created successfully." }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (err: any) {
            return new NextResponse(JSON.stringify({ message: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }


}