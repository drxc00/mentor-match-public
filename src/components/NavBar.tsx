
import React from "react";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import MenuNav from "./MenuNav";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import logo from "../../public/logo.svg"
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";

export default async function NavBar() {

    const session: any = await getServerSession(authOptions);

    return (
        <div className="fixed top-0 left-0 right-0 bg-maroon supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur z-20 shadow-2xl">
            <nav className="h-14 flex items-center justify-between px-2">
                <div className="w-full flex items-center justify-between px-5 py-2">
                    <div className="hidden lg:block">
                        <Link href={"/"}>
                            <div className="flex gap-1 items-center">
                                <Image src={logo} alt="logo" height={35} />
                                <h3 className="scroll-m-20 text-lg py-1 font-semibold tracking-tight text-maroon-foreground">
                                    Mentor Match
                                </h3>
                            </div>
                        </Link>
                    </div>
                    {session ? (
                        session.user.role == "student" ? (
                            <>

                                <div className={cn("block lg:!hidden")}>
                                    <Link href={"/"}>
                                        <Image src={logo} alt="logo" height={35} />
                                    </Link>
                                </div>

                            </>
                        ) : (
                            <>
                                <div className={cn("block lg:!hidden")}>
                                    <MobileSidebar />
                                </div>
                            </>
                        )
                    ) : (
                        <div className="block lg:hidden">
                            <Link href={"/"}>
                                <div className="flex gap-1 items-center">
                                    <Image src={logo} alt="logo" height={35} />
                                </div>
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        {!session ? (
                            <>
                                <Link href={"/login"}>
                                    <Button asChild className="bg-gold-900 hover:bg-gold-700 text-black">
                                        <li>Login</li>
                                    </Button>
                                </Link>
                                <Link href={"/signup"}>
                                    <Button asChild className="bg-gold-900 hover:bg-gold-700 text-black">
                                        <div className="flex flex-row gap-2">
                                            <li className="list-none">Sign Up</li>
                                            <ArrowRightIcon></ArrowRightIcon>
                                        </div>
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            // logged in
                            session.user.role == "student" ? (
                                <>
                                    <Link href="/student/sessions">
                                        <Button asChild variant="link" className="text-maroon-foreground">
                                            <li className="py-2">My sessions</li>
                                        </Button>
                                    </Link>
                                    <MenuNav session={session} />
                                </>
                            ) : (
                                <MenuNav session={session} />
                            )
                        )}
                    </div>
                </div >
            </nav >
        </div >
    )
}
