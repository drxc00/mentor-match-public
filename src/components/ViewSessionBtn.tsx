"use client";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ViewSessionButton({ sessionId, disabled }: { sessionId: string, disabled: boolean }) {

    const router = useRouter();
    function onClick() {
        router.push(`/sessions/${sessionId}`);
    }
    return (
        <Button variant="ghost" className="flex gap-2 bg-maroon-foreground text-xs text-black" onClick={onClick} disabled={disabled}>
            <OpenInNewWindowIcon />
            <h1>View</h1>
        </Button>
    )
}