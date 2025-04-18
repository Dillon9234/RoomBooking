import Session from "@/models/session";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";

export const POST = async(req:NextRequest) => {
    try {
        connectToDB()

        const sessionCookie = req.cookies.get("session_id");
        const sessionId = sessionCookie?.value;
        if(!sessionId){
            return new Response("No Session found",{status:400})
        }
        await Session.deleteOne({sessionId})

        const response = new NextResponse("Logged out successfully",{status:200})
        
        response.cookies.set({
            name: "session_id",
            value: "",
            httpOnly: true,
            path: "/",
            maxAge: 0,
            sameSite: "strict"
        });

        return response

    } catch (error) {
        console.error("Error logging out "+ error)
        return new Response("Error logging out",{status:500})
    }
}