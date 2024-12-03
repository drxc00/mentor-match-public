
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { DataTable } from "../additional-feedback/_components/data-table";
import { columns } from "../additional-feedback/_components/columns";
import { Separator } from "@/components/ui/separator";

export default async function AdditionalFeedback() {

    const sessionData: any = await getServerSession(authOptions);

    if (!sessionData) {
        redirect("/login");
    }

    const url: any = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ?
        `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
        process.env.NEXTAUTH_URL;

    const dataResponse = await fetch(url + "/api/data/sessions?" + new URLSearchParams({
        student_id: sessionData?.user?._id
    }), {
        method: 'GET',
        cache: "no-store"
    });
    const data = await dataResponse.json();

    const concluded = data?.sessionData_student?.filter((session: any) => session.status == "Conclude");

    const filtered = concluded?.filter((session: any) => session.additionalFeedback == "");

    return (
        <div className="container mt-20">
            <div className="py-7">
                <div>
                    <h1 className="text-3xl font-bold text-maroon-700">Rate Your Experience</h1>
                    <p className="text-sm text-muted-foreground">Provide additional feedback on how effective your session</p>
                </div>
                <Separator className="mt-5" />
            </div>
            <div className="mx-auto">
                <DataTable columns={columns} data={filtered} />
            </div>
        </div>
    );
}