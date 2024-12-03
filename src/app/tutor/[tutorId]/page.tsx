import React, { Suspense } from "react";
import DateTable from "./_components/DateTable";
import Loading from "./loading";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DatePagination from "./_components/DatePagination";
import { authOptions } from "@/utils/auth";
export default async function Session({ params }: {
  params: { tutorId: string };
}) {


  const session = await getServerSession(authOptions);
  const tutorId = params.tutorId;

  if (!session) {
    redirect("/");
  }

  const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;

  const response = await fetch(`${url}/api/tutor/${tutorId}`);
  const data = await response.json();

  return (
    <Suspense fallback={<Loading />}>

      <div className=" mt-20">
        <div className="px-4 space-y-6 md:px-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={data.tutor.profile_picture} />
                <AvatarFallback>
                  {data.tutor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0">
                <h1 className="text-2xl font-bold">{data.tutor.name}</h1>
                <p className="text-gray-500">{data.tutor.program}</p>
                <p className="text-gray-500">{data.tutor.email}</p>
                <ul className="flex flex-wrap gap-2">
                  {data.tutor.tags.length != 0 ? (
                    data.tutor.tags.map((tag: string, index: number) => (
                      <li key={index}>
                        <Badge key={index} className="bg-gold-500 text-maroon hover:bg-gold-700">{tag}</Badge>
                      </li>
                    ))
                  ) : (

                    <li>
                      <Badge variant="secondary">Not Available</Badge>
                    </li>
                  )}
                </ul>
              </div>
            </div>


          </div>
          <div className="">
            <DatePagination tutorId={tutorId} />
          </div>
        </div>
      </div>
    </Suspense>

  );
};
