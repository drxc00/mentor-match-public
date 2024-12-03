import Session from "@/models/session.model";
import connect from "@/utils/db.config";
import Conversation from "@/models/conversation.model";
import { NextResponse } from "next/server";

export const POST = async (req: any, res: any) => {
  try {
    const {
      tutor_id,
      student_id,
      course_code,
      course_name,
      description,
      date,
      start_time,
      end_time,
    } = await req.json();

    await connect();


    /**
     *  * convert start time to military time 
     */
    const _splitTime = start_time.split(/:| /);
    const _hour = parseInt(_splitTime[0], 10); //base 10
    const _minute = _splitTime[1]

    const _defaultHour = _hour < 10 ? `0${_hour}` : _hour

    const sTime = `${_splitTime[2].toUpperCase() === "PM" && _hour < 12 ? _hour + 12 : _defaultHour}:${_minute}`

    /**
     * create a new date 
     */
    const sDate = new Date(date.replace(/T.*/, `T${sTime}:00.000Z`));

    /**
     * Create new conversation and add the conversation id to the session
     * for querying
     */

    const conversation = new Conversation({
      participants: [tutor_id, student_id]
    });

    await conversation.save();

    const newSession = new Session({
      tutor: tutor_id,
      student: student_id,
      course_code: course_code,
      course_name: course_name,
      description: description,
      date: sDate,
      start_time: start_time,
      end_time: end_time,
      duration_minutes: 0,
      duration_seconds: 0,
      status: "pending", // default for all sessions requests
      chat_isActive: true,
      conversation: conversation._id
    });

    await newSession.save();

    return new NextResponse(
      JSON.stringify({ message: "Request Successful!" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: error }),
      { status: 500 }
    );
  }
};

export const PATCH = async (req: any, res: any) => {
  try {
    const { _id, status } = await req.json();

    await connect();

    const updatedSession = await Session.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    if (!updatedSession) {
      return new NextResponse(
        JSON.stringify({ message: "Session not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        _id: updatedSession._id,
        status: updatedSession.status,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
};