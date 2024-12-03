import ManageSchedulePagination from "../components/ManageSchedulePagination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


export default async function ManageSchedulePage() {

    const session: any = await getServerSession(authOptions);

    return (

        <div className="w-full p-5">
            <div className="flex space-y-2  p-2 md:p-1 pt-6">
                <div className=" flex flex-col py-2 w-full p-4">
                    <div className="flex items-start">
                        <div>
                            <div>
                                <Breadcrumb className="py-2">
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/dashboard/tutor/my-schedule">My Schedule</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Manage</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-maroon">Manage Schedule</h2>
                                    <p className="text-sm text-muted-foreground">Set unavailable dates</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <ManageSchedulePagination tutorId={session?.user?._id} />
                </div>
            </div>
        </div>
    )
}