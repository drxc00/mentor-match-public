"use client";
import Sidebar from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import SideBarItems from "./sidebaritems";


export function MobileSidebar({ className }: any) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} >
                <SheetTrigger asChild>
                    <div className="border-none p-1 rounded">
                        <MenuIcon size={25} className="text-maroon-foreground"/>
                    </div>
                    
                </SheetTrigger>
                <SheetContent side="left" className="!px-0 bg-maroon-900 border-none">
                    <div className="space-y-4 py-4">
                        <div className="px-3 py-2">
                            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gold-500">
                                Overview
                            </h2>
                            <div className="space-y-1">
                                <SideBarItems session={session} />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}