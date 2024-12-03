import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose, { mongo } from "mongoose";
import Schedule from "@/models/schedule.model";

export const POST = async (request: any) => {

    const { scheduleId, xIndex, yIndex, date, start_time, end_time } = await request.json();

    try {

        await connect();

        if (xIndex >=0 && yIndex >=0) {
            await Schedule.updateOne({ _id: scheduleId }, { $pull: { permanent_indexes: [xIndex, yIndex] } });
        } else if (date && start_time && end_time) {
            await Schedule.updateOne({ _id: scheduleId }, { $pull: { transient_dates: { date: date, start_time: start_time, end_time: end_time } } }, { multi: true });
        }

        return new NextResponse(JSON.stringify({ message: "Schedule Updated Successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Internal Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}