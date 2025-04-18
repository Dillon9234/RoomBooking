import IUser from '@/interfaces/IUser';
import User from '@/models/user';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
    const sessionCookie = req.cookies.get("session_id");
    const sessionId = sessionCookie?.value;
    let authenticated = false
    let role = null
    if(!sessionId){
        return new Response(JSON.stringify({authenticated, role}),{status:400})
    }
    const user:IUser|null = await User.findOne({sessionId}); 
    
    if (!user) {
        return new Response(JSON.stringify({authenticated, role}),{status:200})
    }
    role = user.role
    authenticated = true
    return new Response(JSON.stringify({authenticated, role}),{status:200})
}
