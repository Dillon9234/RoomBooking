import { connectToDB } from "@/utils/database";
import Building from "@/models/building";
import Room from "@/models/room";

interface Context {
  params: Promise<{
    roomid: string;
    id?: string;
  }>;
}

export const POST = async (req: Request, context: Context) => {
  const { number, capacity } = await req.json();
  const { id } = await context.params;

  try {
    await connectToDB();

    const existingBuilding = await Building.findById(id);

    if (!existingBuilding) {
      return new Response("Building not found", { status: 404 });
    }

    const existingRoom = await Room.findOne({ number, building: id });

    if (existingRoom) {
      return new Response(
        "Room with this number already exists in this building",
        { status: 400 },
      );
    }

    const newRoom = new Room({
      number,
      capacity,
      building: id,
    });
    await newRoom.save();

    await Building.findByIdAndUpdate(
      id,
      { $push: { rooms: newRoom._id } },
      { new: true },
    );

    const populatedRoom = await Room.findById(newRoom._id).populate(
      "building",
      "name",
    );

    return new Response(JSON.stringify(populatedRoom), { status: 201 });
  } catch (error) {
    console.error("Failed to create a new room" + error);
    return new Response("Failed to create a new room", { status: 500 });
  }
};
