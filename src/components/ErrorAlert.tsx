import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface ErrorAlertProps {
    message: {
        title: string;
        content: string;
    };
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <Alert variant={"destructive"} className="bg-red-900">
            <ExclamationTriangleIcon className="h-8 w-8" />
            <AlertTitle className="text-white ml-5">{message.title}</AlertTitle>
            <AlertDescription className="text-white ml-5">
                {message.content}
            </AlertDescription>
        </Alert>
    )
}