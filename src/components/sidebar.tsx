import { getServerSession } from "next-auth";
import SideBarItems from "./sidebaritems";
import { authOptions } from "@/utils/auth";

export default async function Sidebar() {
    const session = await getServerSession(authOptions);

    return (
      <nav
        className="relative hidden h-full border-r pt-16 lg:block w-60 bg-maroon-900"
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-gold-500">
                Overview
              </h2>
            </div>
            <SideBarItems session={session}/>
          </div>
        </div>
      </nav>
    );
  }