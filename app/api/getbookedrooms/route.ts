import BookedRooms from "@/models/bookedrooms";
import { connectToDB } from "@/utils/database";

export const GET = async () => {
  try {
    await connectToDB();

    const bookedRooms = await BookedRooms.find({});

    return new Response(JSON.stringify(bookedRooms), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch booked room(s) " + error);
    return new Response("Failed to fetch booked room(s) ", { status: 500 });
  }
};
