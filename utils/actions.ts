"use server"

import {sessionOptions, SessionData, defaultSession} from '@/utils/lib'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'
import User from '../models/user'
import { redirect } from "next/navigation";
import { connectToDB } from './database'

export const getSession = async () => {
    const session = await getIronSession<SessionData>(await cookies(),sessionOptions)

    if(!session.isLoggedIn){
        session.isLoggedIn = defaultSession.isLoggedIn
    }
    return session
}
export const login = async (prevState:{error:undefined|string}, formData:FormData) => {
    const session = await getSession()

    const formUsername = formData.get("username") as string
    const formPassword = formData.get("password") as string

    if (!formUsername || !formPassword) {
        return {error: "Username and password are required"}
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(formPassword, saltRounds);
    connectToDB()

    const user = await User.findOne({ name: formUsername });

    if (!user) {
        return {error: "User not found" };
    }

    const isMatch = await bcrypt.compare(formPassword, user.hashedPassword);
    if (!isMatch) {
        return {error: "Wrong credentials" };
    }

    session.userId = "1"
    session.usename = formUsername
    session.isLoggedIn = true
    session.role = "Admin"
    session.save()
    redirect("/admin")
}
export const logout = async () => {
    const session = await getSession()
    session.destroy()
    redirect("/admin/login")
}