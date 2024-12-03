import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import connect from "@/utils/db.config";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: { tutorId: string } }
) {
  const tutorId = context.params.tutorId;

  await connect();

  //convert tutorId to object
  const objectTutorId = new mongoose.Types.ObjectId(tutorId);

  try {
    const tutor = await User.findById({ _id: objectTutorId });

    if (!tutor)
      return NextResponse.json({
        message: "Not found!",
      });

    if (tutor.role === "student" || tutor.role === "admin")
      return NextResponse.json({
        message: "Denied!",
      });

    return NextResponse.json({
      tutor,
    });
    
  } catch (error) {
    console.error("Error:", error);
    // Handle other errors if needed
    return NextResponse.json({
      message: "Internal Server Error",
    });
  }
}
