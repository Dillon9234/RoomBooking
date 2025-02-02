import { SessionOptions } from "iron-session";

export interface SessionData{
    userId?:string;
    usename?:string;
    isLoggedIn:boolean
    role?:string
}

export const defaultSession:SessionData = {
    isLoggedIn:false
}

export const sessionOptions:SessionOptions = {
    password:process.env.SECRET_KEY!,
    cookieName:"Session",
    cookieOptions:{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production"
    }
}