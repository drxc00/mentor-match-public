
import React, { useEffect } from "react";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/auth";
import Sidebar from "@/components/sidebar";
export default async function Layout({ admin, tutor }: { admin: React.ReactNode, tutor: React.ReactNode }) {
    const session: any = await getServerSession(authOptions);
    let loggedRole;

    if (!session) {
        redirect("/login");
    }

    if (session) {
        if (session.user.role === "student") redirect("/");
        loggedRole = session.user.role;
    }

    // renders the dashbaord based on the role of the logged in user
    return (
        <>
            <div className="flex h-screen overflow-auto">
                <Sidebar />
                <main className="w-full h-full pt-16">
                    {loggedRole === "admin" ? admin : tutor}
                </main>
            </div>
        </>
    )
}
