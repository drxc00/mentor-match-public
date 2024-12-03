"use client";


import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/ui/card';
import { ClockIcon } from '@radix-ui/react-icons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { pusherClient } from '@/utils/pusher';

export default function SessionTimer({ sessionId, actualDurationMinutes, actualDurationSeconds, disabled, isStudent }:
    { sessionId: string, actualDurationMinutes: any, actualDurationSeconds: any, disabled: boolean, isStudent: boolean }) {

    const router = useRouter();
    const { toast } = useToast();
    const [timer, setTimer]: any = useState();
    const [minutes, setMinutes] = useState(() => {

        const storedMinutes = localStorage.getItem('timerMinutes'); // Corrected key name
        return storedMinutes ? parseInt(storedMinutes) : 0;
    });

    const [seconds, setSeconds] = useState(() => {

        const storedSeconds = localStorage.getItem('timerSeconds');
        return storedSeconds ? parseInt(storedSeconds) : 0;
    });

    const [timerStarted, setTimerStarted] = useState(() => {

        const hasStarted = localStorage.getItem('timerStarted');
        return hasStarted ? (hasStarted === "true") : false;
    });

    const startSession = () => {
        setTimerStarted(true);
        localStorage.setItem('timerStarted', "true");

        toast({
            title: "Session Started",
            description: "The session timer has started. Your session is now in progress.",
        })
    }

    const endSession = () => {
        if (timerStarted) {
            clearInterval(timer);
            setTimerStarted(false);

            updateSession("Conclude");

            localStorage.removeItem('timerMinutes');
            localStorage.removeItem('timerSeconds');
            localStorage.removeItem('timerStarted');
        }
    }

    const cancelSession = () => {
        updateSession("Cancel");
    }

    useEffect(() => {
        const triggerServerToast = (title: string, description: string) => {
            toast({
                title: title,
                description: description,
            })
        }

        const sessionTimer = () => {
            if (seconds == 60) {
                setMinutes(minutes + 1); // Incrementing minutes when seconds reach 60
                setSeconds(0); // Resetting seconds to 0
            } else {
                if (seconds < 60 && minutes < 90) {
                    setSeconds(seconds + 1); // Incrementing seconds when they are less than 60
                }
            }
            localStorage.setItem('timerMinutes', minutes.toString()); // Storing minutes in local storage
            localStorage.setItem('timerSeconds', seconds.toString()); // Storing seconds in local storage
        }


        const channelName = `session_status_management__session_${sessionId}`;

        console.log(channelName);
        const sessionUpdatesHandler = () => {
            router.refresh();
            triggerServerToast("Session Concluded", "The session timer has stopped.");
        }

        pusherClient.subscribe(channelName);
        pusherClient.bind("updated_session_status", sessionUpdatesHandler);

        let timer: any;

        if (timerStarted) {
            timer = setInterval(() => {
                sessionTimer();
            }, 1000);
            setTimer(timer);

        }

        return () => {
            clearInterval(timer);
            pusherClient.unsubscribe(channelName);
            pusherClient.unbind("updated_session", sessionUpdatesHandler);
        }
    }, [timerStarted, minutes, seconds, router, toast, sessionId])

    // update session in the database

    const updateSession = async (status: string) => {

        const response = await fetch("/api/edit/sessions/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                _id: sessionId,
                duration_minutes: minutes,
                duration_seconds: seconds,
                status: status
            })
        });

        if (!response.ok) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    return (
        !isStudent ? (
            <>
                <Card className="min-w-[250px] mt-2 lg:ml-2 bg-gold-200">
                    <div className="p-4 grid gap-2">
                        <Card className='bg-gold-200'>
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-2xl font-semibold">
                                    <ClockIcon className="w-5 h-5" />
                                    {disabled ? (
                                        <>
                                            {actualDurationMinutes < 10 ? `0${actualDurationMinutes}` : actualDurationMinutes}:
                                            {actualDurationSeconds < 10 ? `0${actualDurationSeconds}` : actualDurationSeconds}
                                        </>
                                    ) : (
                                        <>
                                            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                        </>
                                    )}
                                </div>
                            </div>
                            <CardHeader className="border-t p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium leading-none">Session Duration</span>
                                    <span className="text-xs font-medium leading-none">90:00</span>
                                </div>
                            </CardHeader>
                        </Card>
                        <div className="grid gap-2 space-y-1" >
                            {/* <Button className="w-full" onClick={startSession} disabled={disabled}>Start Session</Button> */}
                            <AlertDialog>
                                <AlertDialogTrigger disabled={disabled || timerStarted}><Button className="w-full" disabled={disabled || timerStarted}>Start Session</Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Would you like to start the session?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            By clicking &quot;Start Session,&quot; you will begin the session timer.
                                            If the timer reaches its maximum duration of 90 minutes, the session will automatically conclude.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={startSession}>Start Session</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>


                            <AlertDialog>
                                <AlertDialogTrigger disabled={!timerStarted ? true : disabled}><Button className="w-full" variant="outline" disabled={!timerStarted ? true : disabled}>
                                    End Session
                                </Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Would you like to end the session?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to end the session? Ending the session will stop the timer and conclude the session.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={endSession}>End Session</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger disabled={disabled || timerStarted}>
                                    <Button className="w-full bg-maroon-mono" variant="destructive" disabled={disabled || timerStarted}>
                                        Cancel Session
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to cancel the session? If you wish to cancel, make sure to message the user
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={cancelSession}>Cancel Session</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </div>
                </Card>
            </>
        ) : (
            disabled ? (
                <>
                    <Card className="min-w-[250px] mt-2 lg:ml-2">
                        <div className="p-4 grid gap-2">
                            <Card>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-2xl font-semibold">
                                        <ClockIcon className="w-5 h-5" />
                                        {disabled ? (
                                            <>
                                                {actualDurationMinutes < 10 ? `0${actualDurationMinutes}` : actualDurationMinutes}:
                                                {actualDurationSeconds < 10 ? `0${actualDurationSeconds}` : actualDurationSeconds}
                                            </>
                                        ) : (
                                            <>
                                                {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <CardHeader className="border-t p-4 ">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium leading-none">Session Duration</span>
                                        <span className="text-xs font-medium leading-none">90:00</span>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    </Card>
                </>
            ) : (<></>)
        )
    )
}