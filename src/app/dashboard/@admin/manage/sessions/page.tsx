
export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import Loading from "./loading";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function SessionsPage() {
  
  const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;

  const response = await fetch(`${url}/api/data/sessions`, {
    method: "GET",
    cache: "no-store"
  });
  const sessionData = await response.json()

  return (
    <div className="w-full p-5">
      <div className="flex space-y-2 p-2 md:p-1 pt-6">
        <div className=" flex flex-col py-2 w-full p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="py-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/dashboard/manage/sessions">Sessions</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>All Sessions</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-maroon">
                Sessions
              </h2>
              <p className="text-md text-extrabold text-black mt-2">
                Manage sessions (View sessions all sessions.)
              </p>
            </div>
          </div>
          <Suspense fallback={<Loading />}>
            <DataTable columns={columns} data={sessionData.result} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
