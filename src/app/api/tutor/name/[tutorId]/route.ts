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

  const objectTutorId = new mongoose.Types.ObjectId(tutorId);

  try {
    const tutor = await User.findById(objectTutorId);

    if (!tutor) {
      return NextResponse.json(
        {
          message: "Tutor not found",
        },
        { status: 404 }
      );
    }

    const tutorName = tutor.name;

    return NextResponse.json({
      tutor_name: tutorName,
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle other errors if needed
    return NextResponse.json({
      message: "Internal Server Error",
    });
  }
}
