
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import React from "react";
import { columns, User } from "./columns";
import CreateDialogComp from "./_components/CreateDialog";

import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


import { DataTable } from "./data-table";


export default async function ManageUsersPage() {

    const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;

    const res = await fetch(url + "/api/data/users", { cache: "no-store" });

    const responseData = await res.json();

    const data = responseData.message

    return (
        <main className="w-full p-5">
            <div className="flex space-y-2  p-2 md:p-1 pt-6">
                <div className=" flex flex-col py-2 w-full p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <Breadcrumb className="py-2">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/dashboard/manage/users">Users</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>All Users</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h2 className="text-4xl font-bold tracking-tight text-maroon">Users ({data.length})</h2>
                            <p className="text-md text-extrabold text-black mt-2">Manage users (Create, update, and delete users.)</p>
                        </div>
                        <div>
                            <CreateDialogComp />
                        </div>
                    </div>
                    <DataTable columns={columns} data={data} />
                </div>
            </div>

        </main>


    );
}