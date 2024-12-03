import { getServerSession } from "next-auth";
import { columns } from "./_components/columns";
import DataTable from "./_components/data-table";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { all_columns } from "./_components/all-columns";
import { others_columns } from "./_components/others-columns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function TutorSessionsPage() {


  const session: any = await getServerSession(authOptions);


  if (!session) {
    redirect("/login");
  }

  const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;

  const dataResponse = await fetch(
    url +
    "/api/data/sessions?" +
    new URLSearchParams({
      tutor_id: session?.user?._id,
    }),
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await dataResponse.json();

  const scheduled = data.result.filter((session: any) => session.status == "Accept");
  const requests = data.result.filter((session: any) => session.status == "pending");
  const others = data.result.filter((session: any) => session.status == "Conclude" || session.status == "Cancel" || session.status == "Reject");

  return (
    <main className="w-full p-5">
      <div className="flex space-y-2  p-2 md:p-1 pt-6">
        <div className=" flex flex-col py-2 w-full p-4">
          <div className="flex items-start justify-between">
            <div>
              <Breadcrumb className="py-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/tutor/my-sessions">My Sessions</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Sessions</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-3xl font-bold tracking-tight text-maroon">Your Sessions</h2>
              <p className="text-sm text-muted-foreground">Manage sessions (View, accept, and deny)</p>
            </div>
          </div>

          <Suspense fallback={<Loading />}>
            <Tabs defaultValue="all" className="py-6">
              <TabsList className="bg-gold-500">
                <TabsTrigger value="all">Upcoming</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
              </TabsList>
              <TabsContent value="all" >
                <DataTable columns={all_columns} data={scheduled} />
              </TabsContent>
              <TabsContent value="requests">
                <DataTable columns={columns} data={requests} />
              </TabsContent>
              <TabsContent value="others">
                <DataTable columns={others_columns} data={others} />
              </TabsContent>
            </Tabs>
          </Suspense>
        </div>
      </div>
    </main>

  );
}
