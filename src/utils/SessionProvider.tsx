"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

// Provides Authentication to all children
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}

export default AuthProvider;