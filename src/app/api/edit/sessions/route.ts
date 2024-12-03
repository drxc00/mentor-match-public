import Session from "@/models/session.model";
import connect from "@/utils/db.config";
import { pusherServer } from "@/utils/pusher";
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

    const newSession = new Session({
      tutor: tutor_id,
      student: student_id,
      course_code: course_code,
      course_name: course_name,
      description: description,
      date: new Date(date),
      start_time: start_time,
      end_time: end_time,
      status: "pending", // default for all sessions requests
    });

    await newSession.save();

    return new NextResponse(
      JSON.stringify({ message: "Request Successful!" }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

export const PATCH = async (req: any, res: any) => {
  try {
    const { _id, status, duration_minutes, duration_seconds } = await req.json();

    await connect();

    const updatedSession = await Session.findOneAndUpdate(
      { _id },
      {
        status: status,
        duration_minutes: duration_minutes ? parseInt(duration_minutes): 0,
        duration_seconds: duration_seconds ? parseInt(duration_seconds): 0
      },
      { new: true }
    );

    if (!updatedSession) {
      return new NextResponse(
        JSON.stringify({ message: "Session not found" }),
        { status: 404 }
      );
    }

    await pusherServer.trigger(
      `session_status_management__session_${_id}`,
      "updated_session_status",
      {
        _id: _id,
        status: status,
        duration_minutes: duration_minutes ? parseInt(duration_minutes): 0,
        duration_seconds: duration_seconds ? parseInt(duration_seconds): 0
      }
    )

    return new NextResponse(
      JSON.stringify({
        _id: updatedSession._id,
        status: updatedSession.status,
        duration_minutes: updatedSession.duration_minutes,
        duration_seconds: updatedSession.duration_seconds
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