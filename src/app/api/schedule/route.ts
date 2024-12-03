import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose, { mongo } from "mongoose";
import Schedule from "@/models/schedule.model";


export const POST = async (request: any) => {
    const { tutor_id, xIndex, yIndex, transient_date }: any = await request.json();


    try {
        await connect();

        let schedule: any = await Schedule.find({ tutor: new mongoose.Types.ObjectId(tutor_id) });

        if (schedule.length == 0) {
            
            const newSchedule = new Schedule({
                tutor: new mongoose.Types.ObjectId(tutor_id),
                permanent_indexes: [],
                transient_dates: []
            });

            await newSchedule.save();
            schedule = await Schedule.find({ tutor: new mongoose.Types.ObjectId(tutor_id) });
            
        }

        const indexArr = [parseInt(xIndex), parseInt(yIndex)];
        
        // ensures that all indexes are allowed
        if (xIndex >= 0 && yIndex >= 0) {
            schedule[0].permanent_indexes.push(indexArr)
        } else {

            schedule[0].transient_dates.push(transient_date);
        }

        await schedule[0].save(); // Save the changes to the schedule

        return new NextResponse(JSON.stringify({ message: "Schedule Updated Successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}