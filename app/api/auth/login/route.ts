import IUser from "@/interfaces/IUser";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import { createSession } from "@/utils/session";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest) => {
  try{
    await connectToDB();

    const { username, password } : {username:string, password:string } = await req.json();

    const user = await User.findOne({ username });
    if (!user) 
        return NextResponse.json({message:"Invalid credentials"},{status:401});

    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) 
        return NextResponse.json({message:"Invalid credentials"},{status:401});

    const sessionId = await createSession(user._id);

    const response = NextResponse.json({message:"logged in succesfuly",username:user.name,role:user.role},{status:201})

    response.cookies.set({
        name: "session_id",
        value: sessionId,
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict"
    });

    return response
  }catch(error){
    console.error("Failed to Login" + error)
    return NextResponse.json({message:"Failed to Login"},{status:500});
  }
}
