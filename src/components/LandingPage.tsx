"use client";

import { ArrowRightCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {

    const router = useRouter();

    return (
        <>
        <div className="flex flex-col h-full justify-center items-center">
            <h1 className="text-maroon font-extrabold text-8xl tracking-tight hover:tracking-wide transition-all">
                Mentor Match
            </h1>
            <p className="text-muted-foreground font-semibold text-2xl mt-2 tracking-widest">Where your education meets its match</p>
            <Button variant={"ghost"} className="animate-bounce pr-10 pl-10 text-lg bg-gold-900 text-black mt-10" onClick={() => router.push("/signup")}>
                Join Mentor Match for Free
                <ArrowRightCircle className="h-4 w-4 ml-2" />
            </Button>
            <h6 className="text-muted-foreground text-xs">
            Already have an account?{" "}
            <Button variant={"link"} className="text-xs underline p-0 text-muted-foreground" onClick={() => router.push("/login")}>
                Log in here.
            </Button>
            </h6>
        </div>
        <div className="flex items-center w-full p-6 z-50">
        <div className="md:ml-auto w-full justify-between md:justify-start flex items-center gap-x-2 text-muted-foreground">
          <Button className="text-muted-foreground" variant="ghost" size="sm">
            Privacy Policy
          </Button>
        </div>
        <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
          <Button className="text-muted-foreground" variant="ghost" size="sm">
            Terms and Services
          </Button>
        </div>
      </div>
        </>
    );
}