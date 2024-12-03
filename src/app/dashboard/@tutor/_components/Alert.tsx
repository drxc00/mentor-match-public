"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { redirect, useRouter } from "next/navigation";


export default function AlertProfile({ open }: { open: boolean }) {
    const router = useRouter();
    return (
        <AlertDialog open={open} >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Specialization Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        To provide the best tutoring experience, please add your specialization
                        to your profile. This will help students find you based on your expertise.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => router.push("/settings")}>Add Specialization</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    );
}