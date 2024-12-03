"use client";
import { FontSizeIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdditionalFeedbackBtn(

) {

    const router = useRouter();
    function onClick() {
        router.push(`/student/additional-feedback`);
    }
    return (
        <div>
            <Button variant="ghost" className="flex gap-2 bg-maroon-foreground hover:bg-amber-300 text-maroon" onClick={onClick}>
                Rate Us!
            </Button>
        </div>
    )
}