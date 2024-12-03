"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, SendIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { pusherClient } from "@/utils/pusher";

//chats, sessionId paramter removed
export default function ChatBox({ userId, sessionConcluded, isStudent, isChatActive, otherUserId, conversationId, sessionId}: any) {
    const [sending, setSending] = useState(false);
    const router = useRouter();
    const inputRef: any = useRef(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    //const inputRef = useRef<HTMLInputElement>(null);

    const [chats, setMessages] = useState([]);

    useEffect(() => {
        async function fetchMessages() {

            try {
                const res = await fetch("/api/chat/getMessage?" + new URLSearchParams({conversationId: conversationId}), {
                    method: 'GET',
                    cache: "no-store"
                });

                if (res.ok) {
                    const data = await res.json();
                    setMessages(data.messageArray);
                    // console.log("data from useEffect: ", data);
                    //console.log("chats: ", chats.messageArray);
                } else {
                    console.error('Failed to fetch data:', res.status);
                }
            } catch (error) {
                console.log("error in fetchMessages function: ", error);
            }
        }
        
        fetchMessages();

        const channelName = `sending_messages__session__${sessionId}`;

        const newMessageHandler = () => {
            console.log("new message sent");
            // Refresh the page or handle the new message event as needed
            fetchMessages();
            router.refresh();
        };
        pusherClient.subscribe(channelName);
        pusherClient.bind("sent_new_message", newMessageHandler);

        return () => {
            pusherClient.unbind("sent_new_message", newMessageHandler);
            pusherClient.unsubscribe(channelName);
        };


    }, [otherUserId, userId, router, conversationId, sessionId, setSending]);

    // console.log("chats: ", chats);


    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSending(true);

        const formData = new FormData(event.currentTarget)
        var messageContent = formData.get('message') as string;

        //await sendMessage(message); //idk if this should be included
        //console.log("message: ", messageContent); 

        const requestBody = {
            sessionId: sessionId,
            conversationId: conversationId,
            receiverId: otherUserId,
            senderId: userId,
            message: messageContent
        }

        const res = await fetch(`/api/chat/sendMessage/`, {
            method: 'POST',
            // body: JSON.stringify({
            //     senderId: userId,
            //     message: messageContent
            // })
            body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
            console.log("Error in sending message!");
        } else {
            setSending(false);
            if (inputRef.current) {
                inputRef.current.value = ''; // Reset the input value
            }
        }

        router.refresh();
        inputRef!.current!.value = '';
    }



    useEffect(() => { //scrolls to bottom after reload
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);


    function extractTime(dateString: any) { //gets timestamp for message
        const currentDate = new Date();
        const dateOfCurrentDate = currentDate.getDate();
        const messageDate = new Date(dateString);
        const dateOfMessageDate = messageDate.getDate();

        const hours = padZero(messageDate.getHours());
        const minutes = padZero(messageDate.getMinutes());

        if (dateOfCurrentDate > dateOfMessageDate) { //if message sent is yesterday
            const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
            const dayOfWeek = currentDate.toLocaleDateString(undefined, options);
            return `${dayOfWeek} ${hours}:${minutes}`;
        }

        else {
            return `${hours}:${minutes}`;
        }
    }


    function padZero(number: any) {
        return number.toString().padStart(2, "0");
    }

    return (
        <>
            <Card className="w-full bg-gold-200">
                <CardHeader>
                    <div className="flex justify-between">
                        <div className="flex items-center text-maroon-mono">
                            <MessageCircle className="mr-3" />
                            <h2 className="text-3xl font-extrabold text-maroon-mono">Mentor Chat</h2>
                        </div>
                    </div>
                    <p className="text-md text-black">Communicate with your tutor during the session.</p>
                    <Separator />
                </CardHeader>
                <CardContent className="max-h-[325px] min-h-[325px]  p-0 flex flex-col justify-end">
                    <div ref={chatContainerRef} className="grid gap-2 p-4 overflow-y-scroll">
                        {/* <Messages /> */}
                        {chats.length != 0 ? (
                            chats.map((chat: any, index: any) => (
                                chat.senderId == userId ? (
                                    <div className="justify-right text-right rounded-lg bg-maroon-900 border p-4" key={index}>

                                        <p className="text-sm text-gray-200">{chat.message}</p>
                                        <p className="text-xs text-gray-200 mt-2">{extractTime(chat.createdAt)}</p>

                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-gold-muted border p-4" key={index}>
                                        <p className="text-sm text-zinc-950">{chat.message}</p>
                                        <p className="text-xs text-zinc-950 mt-2">{extractTime(chat.createdAt)}</p>

                                    </div>
                                )

                            ))
                        ) : (
                            <div className="rounded-lg bg-gray-100 p-4">
                                <div className="text-sm">NO CHATS</div>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <form id="form" onSubmit={onSubmit}   >
                            <div className="flex items-center gap-2">
                                <Input ref={inputRef} placeholder="Type a message" type="text" name="message"/>
                                <Button className="bg-maroon-700 hover:bg-maroon" disabled={sending}>Send<SendIcon className="ml-4 w-4 h-4 " /></Button>
                            </div>
                        </form>
                        <p id="log"></p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}