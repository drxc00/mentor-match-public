
import React from "react";
import { DataTable } from "@/app/student/sessions/data-table";
import { columns } from "@/app/student/sessions/columns";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdditionalFeedbackBtn from "@/components/AdditionalFeedbackBtn";

export default async function StudentSessionsPage() {
    const session: any = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;

    const dataResponse = await fetch(url + "/api/data/sessions?" + new URLSearchParams({
        student_id: session?.user?._id
    }), {
        method: 'GET',
        cache: "no-store"
    });
    const data = await dataResponse.json();

    const scheduled = data?.sessionData_student?.filter((session: any) => session.status != "pending" && session.status != "Cancel" && session.status != "Reject" && session.status != "Conclude");
    const requested = data?.sessionData_student?.filter((session: any) => session.status == "pending");
    const concluded = data?.sessionData_student?.filter((session: any) => session.status == "Conclude");
    const others = data?.sessionData_student?.filter((session: any) => session.status == "Cancel" || session.status == "Reject");

    return (
        <>
            <div className="container mt-20">
                <div className="py-7">
                    <div>
                        <h2 className="text-3xl font-bold text-maroon-700">
                            My sessions
                        </h2>
                        <p className="text-sm text-muted-foreground">View all of your upcoming, past, and request tutoring sessions</p>
                    </div>
                    <Separator className="mt-5"/>
                    <div className="mt-5"> 
                        <Tabs defaultValue="scheduled">
                            <TabsList className="bg-gold-500">
                                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                                <TabsTrigger value="requested">Requested</TabsTrigger>
                                <TabsTrigger value="concluded">Concluded</TabsTrigger>
                                <TabsTrigger value="others">Others</TabsTrigger>
                            </TabsList>
                            <TabsContent value="scheduled">
                                <div className="mx-auto">
                                    <DataTable columns={columns} data={scheduled} />
                                </div>
                            </TabsContent>
                            <TabsContent value="requested">
                                <div className="mx-auto">
                                    <DataTable columns={columns} data={requested} />
                                </div>
                            </TabsContent>
                            <TabsContent value="concluded">
                                <div className="mx-auto">
                                    <DataTable columns={columns} data={concluded} />
                                </div>
                            </TabsContent>
                            <TabsContent value="others">
                                <div className="mx-auto">
                                    <DataTable columns={columns} data={others} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div>
                    <AdditionalFeedbackBtn />
                </div>
            </div>
        </>
    )
}