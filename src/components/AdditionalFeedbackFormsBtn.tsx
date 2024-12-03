"use client";
import { FontSizeIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdditionalFeedbackFormsBtn({ sessionId, disabled }: { sessionId: string, disabled: boolean }) {

    const router = useRouter();
    function onClick() {
        router.push(`/student/additional-feedback/${sessionId}`);
    }
    return (
        <div>
            <Button variant="ghost" className="flex gap-2 bg-maroon-foreground text-xs text-black" size="lg" onClick={onClick} disabled={disabled}>
                <h1>Rate session!</h1>
            </Button>
        </div>
    )
}