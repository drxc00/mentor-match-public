

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Mentor Match",
  description: "Where your education meets its match",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className + "overflow-hidden bg-gold"}>
          <NavBar />
          <div>
            <Toaster />
            {children}
          </div>

        </body>
      </html>
    </SessionProvider>
  );
}
