import Session from "@/models/session";
import { v4 as uuidv4 } from "uuid";

export async function createSession(userId: string) {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await Session.create({
    sessionId,
    userId,
    expiresAt,
  });

  return sessionId;
}

export async function getUserFromSession(sessionId: string) {
  const session = await Session.findOne({ sessionId }).populate("userId");

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.userId;
}
