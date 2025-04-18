import User from "@/models/user";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "@/utils/database";

export const POST = async (req:NextRequest) => {
    try{
        const { username, password, role} : {username:string,password:string,role:string} = await req.json();

        connectToDB()

        const existisingUser = await User.findOne({username})

        if(existisingUser){
            return new Response("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            hashedPassword,
            role
        })

        newUser.save()

        return new Response("User Created", {status:200})

    }catch(error){
        console.error("Failed to register user" + error)
        return new Response("Failed to register user", {status:500})
    }
}