"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react";

const MenuNav = ({ session }: any) => {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarImage src={session.user?.profile_picture} />
                        <AvatarFallback>{session.user?.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 p-2 text-maroon bg-gold-muted border">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {session.user.role !== "student" ? (
                            <a href="/dashboard">
                                <DropdownMenuItem>
                                    Dashboard
                                </DropdownMenuItem>
                            </a>

                        ) : (
                            <a href="/">
                                <DropdownMenuItem>
                                    Home
                                </DropdownMenuItem>
                            </a>
                        )}
                        <a href="/settings">
                            <DropdownMenuItem>
                                Settings
                            </DropdownMenuItem>
                        </a>

                        <DropdownMenuItem onClick={()=>{signOut({callbackUrl: "/", redirect: true})}}>
                            Sign Out
                        </DropdownMenuItem>


                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}

export default MenuNav;