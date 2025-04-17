import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import Session from "@/models/session";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import ISession from "@/interfaces/ISession";

type Role = "admin" | "user"; // Extend as needed

interface Options {
  roles?: Role[];
}

interface User {
  username: string;
  role: Role;
}

interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

type Handler = (req: AuthenticatedRequest) => Promise<void | any>;

async function getUserFromSession(sessionId: string): Promise<User | null> {
  connectToDB();

  const session: ISession | null = await Session.findOne({ sessionId });

  if (!session) return null;

  const user = await User.findOne({ sessionId: session.userId });

  return user as User | null;
}

export function withAuth(handler: Handler, options: Options = {}) {
  const { roles = [] } = options;

  return async (req: NextRequest) => {

    const sessionCookie = req.cookies.get("session_id");
    const sessionId = sessionCookie?.value;

    if (!sessionId) {
        return new Response("Not authenticated",{status:401});
    }

    const user = await getUserFromSession(sessionId);

    if (!user) {
        return new Response("Invalid session",{status:401});
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return new Response("Forbidden: Insufficient privileges",{status:403});
    }

    (req as AuthenticatedRequest).user = user;

    return handler(req as AuthenticatedRequest);
  };
}
