import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import connect from "@/utils/db.config";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: { studentId: string } }
) {
  const studentId = context.params.studentId;

  await connect();

  const objectStudentId = new mongoose.Types.ObjectId(studentId);

  try {
    const student = await User.findById(objectStudentId);

    if (!student) {
      return NextResponse.json(
        {
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    const studentName = student.name;

    return NextResponse.json({
      student_name: studentName,
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle other errors if needed
    return NextResponse.json({
      message: "Internal Server Error",
    });
  }
}
