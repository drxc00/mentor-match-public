import Session from "@/models/session.model";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db.config";
import mongoose from "mongoose";
import Schedule from "@/models/schedule.model";
import { revalidatePath } from "next/cache";

/**
 * POST request route for querying the sessions document
 * Data returned will be based on the specific query
 */
export const GET = async (request: NextRequest) => {

    const session_id = request.nextUrl.searchParams.get("session_id");
    const tutor_id = request.nextUrl.searchParams.get("tutor_id");
    const student_id = request.nextUrl.searchParams.get("student_id");
    const firstDay: any = request.nextUrl.searchParams.get("firstDay");
    const lastDay: any = request.nextUrl.searchParams.get("lastDay");

    const start_time: any = request.nextUrl.searchParams.get("start_time");
    const end_time: any = request.nextUrl.searchParams.get("end_time");
    const session_date: any = request.nextUrl.searchParams.get("session_date");
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    endDate.setHours(23, 59, 59);

    
    try {

        await connect();

        if (session_id) {
            const sessionData = await Session.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(session_id) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "tutor",
                        foreignField: "_id",
                        as: "tutor"
                    }
                },
                {
                    $unwind: "$tutor"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "student",
                        foreignField: "_id",
                        as: "student"
                    }
                },
                {
                    $unwind: "$student"
                },
                // {
                //     $lookup: {
                //         from: "messages",
                //         let: { messages: "$messages" },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $in: ['$_id', "$$messages"]
                //                     }
                //                 }
                //             }
                //         ],
                //         as: "messages"
                //     }
                // },
                {
                    $lookup: {
                        from: "feedbacks",
                        let: { feedbacks: "$feedbacks" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', "$$feedbacks"]
                                    }
                                }
                            }
                        ],
                        as: "feedbacks"
                    }
                }
            ]);

            return new NextResponse(JSON.stringify({ sessionData }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (tutor_id != null) {

            revalidatePath(request.url); //leave this for now idk

            let sessionData_tutor;

            // get schedule of the tutor
            let schedule: any = await Schedule.find({ tutor: new mongoose.Types.ObjectId(tutor_id) });

            if (firstDay != null && lastDay != null) {
                sessionData_tutor = await Session.aggregate([
                    {
                        $match: { tutor: new mongoose.Types.ObjectId(tutor_id) }
                    },
                    {
                        $match: {
                            date: {
                                $gte: startDate,
                                $lte: endDate
                            }
                        }
                    }
                ]);

            } else {
                sessionData_tutor = await Session.aggregate([
                    {
                        $match: { tutor: new mongoose.Types.ObjectId(tutor_id) }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "tutor",
                            foreignField: "_id",
                            as: "tutor"
                        }
                    },
                    {
                        $unwind: "$tutor"
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "student",
                            foreignField: "_id",
                            as: "student"
                        }
                    },
                    {
                        $unwind: "$student"
                    },
                    { $sort: { date: 1 } },
                ]);
            }

            //gusto ko gawing sessionData_tutor nalang instead of result para mas consistent sa data calls kaso
            //it breaks something on the student part so ganyan nalang siguro

            return new NextResponse(JSON.stringify({ result: sessionData_tutor, schedule: schedule }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });

        } else if (student_id) {
            const sessionData_student = await Session.aggregate([
                {
                    $match: { student: new mongoose.Types.ObjectId(student_id) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "tutor",
                        foreignField: "_id",
                        as: "tutor"
                    }
                },
                {
                    $unwind: "$tutor"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "student",
                        foreignField: "_id",
                        as: "student"
                    }
                },
                {
                    $unwind: "$student"
                },
                { $sort: { date: 1 } },
            ]);

            return new NextResponse(JSON.stringify({ sessionData_student }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (session_date && start_time && end_time) {
            const schedules = await Schedule.find({});
            const unavailableTutor = await Session.find({
                date: session_date,
                start_time: start_time,
                end_time: end_time
            });

            return new NextResponse(JSON.stringify({ result: unavailableTutor, schedules: schedules}), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        } else {
            /**
             * return all sessions aggregated with information of the student and tutors
             */

            const sessions_all = await Session.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "tutor",
                        foreignField: "_id",
                        as: "tutor"
                    }
                },
                {
                    $unwind: "$tutor"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "student",
                        foreignField: "_id",
                        as: "student"
                    }
                },
                {
                    $unwind: "$student"
                },
                { $sort: { date: 1 } },
            ]);

            return new NextResponse(JSON.stringify({ result: sessions_all }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        }
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: err }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}