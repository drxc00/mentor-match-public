import UserProfile from "@/components/UserProfile";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function Profile() {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { user }: any = session;

  return (

    <div className="container mt-20">
      <div className="py-7">
        <div>
          <h2 className="text-3xl font-bold text-maroon-700">
            Profile
          </h2>
          <p className="text-sm text-muted-foreground"> This is how others will see you on the site.</p>
          <Separator className="mb-5"/>
        </div>
        <UserProfile />
      </div>
    </div>

  )
}