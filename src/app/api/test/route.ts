import connect from "@/utils/db.config";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
    /**
     * for testing database connection
     */

    try {

        await connect();
        return new NextResponse(JSON.stringify({ message: "" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Internal Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}