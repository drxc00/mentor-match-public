import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdditionalFeedbackForm from "../_components/AdditionalFeedbackForm";
import mongoose from "mongoose";
import Session from "@/models/session.model";

//params: userId, selectedSession, tutorOfSession

export default async function RateSessionPage({ params }: {
    params: { sessionId: string }}
)

{
const sessionData: any = await getServerSession(authOptions);
    if (!sessionData) {
        redirect("/login");
    }
    // console.log("session data", sessionData);
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

        // const chosenSession = data?.sessionData_student?.filter((session: any) => session._id == params.sessionId );

        const session_id = params.sessionId;

        const res = await fetch(url + `/api/additionalFeedback/getTutorOfSession`, {
            method: 'POST',
            cache: "no-store",
            body: JSON.stringify({
                sessionId: session_id
            })
        })

        const tutorOfSession = await res.json();
        // console.log("tuttttoooorrr", tutorOfSession);

        const unpackedData = tutorOfSession.tutorId;
        // console.log("unpackedData", unpackedData);

        const loggedInStudent = sessionData.user._id;

    return(
        <div className="container mt-20">
            <AdditionalFeedbackForm 
                userId = {loggedInStudent}
                selectedSession = {params.sessionId}
                tutorOfSession = {unpackedData}
                />
        </div>
    )
}