import User from "@/models/user.model";
import connect from "@/utils/db.config";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  try {
    const {
      id,
      username,
      name,
      university_number,
      email,
      program,
      password,
      role,
      specializations
    } = await request.json();
    
    await connect();

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        username,
        name,
        university_number,
        email,
        program,
        password,
        role,
        tags: specializations
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};