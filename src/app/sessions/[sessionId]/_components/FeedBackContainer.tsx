"use client";

import { useRouter } from "next/navigation";
import Feedback from "./FeedBack"
import FeedBackForm from "./FeedBackForm"

export default function FeedBackContainer({ isThereFeedback, yourFeedback, sessionInformation, isStudent }:
    { isThereFeedback: boolean, sessionInformation: any, isStudent: boolean, yourFeedback: any }) {

    return (
        <div className="flex flex-col mt-2">
            <div className="flex text-center flex-col">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight first:mt-0">
                    Feedback
                </h1>
                <p className="leading-7 [&:not(:first-child)] w-auto">
                    Session feedback is essential for improvement.
                    It provides valuable insights, fosters open communication,
                    and enables tailored experiences for future sessions.
                </p>
            </div>
            {!isThereFeedback ? (
                <FeedBackForm
                    isStudent={isStudent}
                    session={sessionInformation._id}
                    tutor={sessionInformation.tutor._id}
                    student={sessionInformation.student._id}
                />
            ) : (

                <>
                    <div className="p-5">
                        <Feedback feedback={yourFeedback} />
                    </div>

                </>
            )
            }
        </div>
    )
}