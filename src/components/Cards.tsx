"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link";
import Image from "next/image";

interface Tutor {
  _id: string;
  username: string;
  name: string;
  program: string;
  email: string;
  tags: string[];
  profile_picture: string;
}

const TutorCardListSkeleton = () => {
  return (
    <div className="flex flex-wrap pb-10">
      <div className="container flex flex-wrap justify-center gap-5 ">
        <div className="flex flex-col space-y-3 my-5">
          <Skeleton className="h-[300px] w-[300px] rounded-xl" />
          <div className="space-y-2 flex items-center justify-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 my-5">
          <Skeleton className="h-[300px] w-[300px] rounded-xl" />
          <div className="space-y-2 flex items-center justify-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 my-5">
          <Skeleton className="h-[300px] w-[300px] rounded-xl" />
          <div className="space-y-2 flex items-center justify-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TutorCardList = () => {
  const { data: session, status }: any = useSession();
  const [tutorData, setTutorData] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/tutor", {
          method: "GET",
        });

        if (!response.ok) {
          console.error(
            `Failed to fetch tutor data. Status: ${response.status}`
          );
          return;
        }

        const responseBody = await response.json();

        if (responseBody && responseBody.body && responseBody.body.tutors) {
          const fetchedTutorData: Tutor[] = responseBody.body.tutors;
          setLoading(false);
          setTutorData(fetchedTutorData);
        } else {
          console.error("Invalid response format:", responseBody);
        }
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };

    if (session.user.role === "student") {
      fetchData();
    }
  }, [session.user.role, setLoading]);

  return (
    <div className="flex flex-wrap pb-10">
      {loading && <TutorCardListSkeleton />}
      {status === "authenticated" && session.user.role === "student" && (
        <div className="container flex flex-wrap justify-center">
          {tutorData.map((tutor) => (
            <div key={tutor._id} className="my-5 mx-2 w-[300px] shadow-xl">

              <div className="flex flex-col w-full rounded-xl border border-gold-500 bg-gold-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-950 dark:shadow-sm">

                {tutor.profile_picture == "" ? (
                  <div className="flex w-full aspect-[4/3] bg-gold-500">
                  </div>
                ) : (
                  <div className="flex w-full aspect-[4/3] bg-gold-500">
                    <Image
                      alt="User"
                      className="object-cover"
                      height="500"
                      src={tutor.profile_picture}
                      style={{
                        aspectRatio: "400/300",
                        objectFit: "cover",
                      }}
                      width="500"
                    />
                  </div>
                )}

                <div className="flex-1 p-4 grid gap-2">
                  <div className=" text-sm">
                    <h3 className="font-bold text-lg">{tutor.name}</h3>
                    <h3 className="font-sm text-gray-500">{tutor.program}</h3>
                    <div className="p-2 gap-2">
                      {tutor.tags.length === 0 ? (
                        <span className="rounded-lg border text-xs leading-none p-1 px-3 text-center bg-gold-muted  dark:border-gray-800 text-gray-500 dark:bg-gray-900">
                          Not Available
                        </span>
                      ) : (

                        tutor.tags.map((tag, index) => (
                          <span key={index} className="rounded-lg border text-xs leading-none p-1 px-3 text-center bg-gold-muted dark:border-gray-800 text-gray-500 dark:bg-gray-900">
                            {tag.charAt(0) + tag.slice(1)}
                          </span>
                        ))

                      )}
                    </div>
                  </div>
                  <Button className="p-4 bg-maroon hover:bg-maroon-900" size="sm" asChild>
                    <Link href={"/tutor/" + tutor._id}>
                      View Schedule
                    </Link>
                  </Button>
                </div>
              </div>
              {/* <Card className="w-full rounded-xl scale-95 hover:scale-100 bg-maroon-900">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={tutor.profile_picture} />
                    <AvatarFallback>
                      {tutor.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center text-maroon-foreground">
                    <h2 className="text-xl font-bold">{tutor.name}</h2>
                    <p className="text-md text-white">{tutor.program}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 -m-2">
                    {tutor.tags.length === 0 ? (
                      <div>
                        <span className="rounded-full border text-xs leading-none p-1 px-3 text-center border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                          Not Available
                        </span>
                      </div>
                    ) : (

                      tutor.tags.map((tag, index) => (
                        <span key={index} className="rounded-full border text-xs leading-none p-1 px-3 text-center border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                          {tag.charAt(0) + tag.slice(1)}
                        </span>
                      ))

                    )}
                  </div>
                  <div className="mt-4">
                    <Button className="bg-maroon-foreground text-black font-bold hover:bg-maroon-mono hover:text-white" size="sm" onClick={() => { router.push("/tutor/" + tutor._id) }}>Request Tutoring</Button>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorCardList;