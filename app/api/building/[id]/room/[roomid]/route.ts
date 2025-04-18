import { connectToDB } from "@/utils/database";
import Room from "@/models/room";
import { NextRequest } from "next/server";

interface Context {
  params: Promise<{
    roomid: string;
    id?: string;
  }>;
}

export const GET = async (req: NextRequest, context: Context) => {
  try {
    const { id, roomid } = await context.params;

    if (!id) return new Response("Building ID is required", { status: 400 });

    await connectToDB();
    const room = await Room.findById(roomid);

    if (!room) return new Response("room not found", { status: 404 });

    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error) {
    console.error("Failed to fetch room " + error);
    return new Response("Failed to fetch room", { status: 500 });
  }
};
