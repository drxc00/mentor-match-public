import User from "@/models/user.model";
import connect from "@/utils/db.config";
import { NextResponse, NextRequest } from "next/server";
export const GET = async (request: NextRequest, res: Response) => {

  const excludedTutorIds = request.nextUrl.searchParams.get("excluded_tutor_ids");
  const specialization_topic_tag = request.nextUrl.searchParams.get("topic");

  try {
    await connect();

    if (excludedTutorIds || specialization_topic_tag) {
      const tutor_ids = excludedTutorIds?.split(",");


      const query = excludedTutorIds?.length != 0 ? {
        _id: { $nin: tutor_ids },
        role: "tutor",
        tags: { $elemMatch: { $eq: specialization_topic_tag } }
      } : {
        role: "tutor",
        tags: { $elemMatch: { $eq: specialization_topic_tag } }
      }
      const tutors = await User.find(query);

      return new NextResponse(JSON.stringify({
        status: 200,
        body: {
          tutors
        },
      }));

    } else {

      const tutors = await User.find({ role: "tutor" });

      return new NextResponse(JSON.stringify({
        status: 200,
        body: {
          tutors,
        },
      }));
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({
      status: 500,
      body: {
        error: "Internal Server Error",
      },
    }));
  }
};
