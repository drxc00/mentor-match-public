import TutorCardList from "@/components/Cards";
import LandingPage from "@/components/LandingPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstantMatch from "@/components/InstantMatch";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export default async function Home() {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    // console.log("landing")
    // redirect("/landing");

    return (
      <div className="flex flex-col h-screen text-center items-center justify-center bg-gold w-screen overflow-x-hidden">
        <LandingPage />
      </div>
    )
  }

  if (session.user.role != "student") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-screen text-center items-center justify-center bg-gold w-screen overflow-x-hidden pt-16">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 xl:gap-10">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-1xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-maroon relative">Find your perfect tutor</h1>
          <p className="text-gray-500 md:text-md/relaxed dark:text-gray-400 justify-center mx-auto max-w-[700px]">
            Ready to learn? Discover the perfect tutor for you.
            {/* Choose between our innovative instant match feature or explore through manual lookup. */}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <Tabs defaultValue="instant-match">
          <TabsList className="bg-gold-500">
            <TabsTrigger value="instant-match"> Instant Match </TabsTrigger>
            <TabsTrigger value="manual-lookup"> Manual Lookup </TabsTrigger>
          </TabsList>
          <TabsContent value="instant-match">
            <div >
              <InstantMatch />
            </div>
          </TabsContent>
          <TabsContent value="manual-lookup">
            <div>
              <TutorCardList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
