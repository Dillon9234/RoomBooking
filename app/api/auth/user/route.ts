import User from '@/models/user';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
    const sessionCookie = req.cookies.get("session_id");
    const sessionId = sessionCookie?.value;
    let authenticated = false
    if(!sessionId){
        return new Response(JSON.stringify(authenticated),{status:400})
    }

    const user = await User.findOne({ sessionId}); 

    if (!user) {
        return new Response(JSON.stringify(authenticated),{status:200})
    }
    authenticated = true
    return new Response(JSON.stringify(authenticated),{status:200})
}
