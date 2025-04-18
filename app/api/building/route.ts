import { connectToDB } from "@/utils/database";
import Building from "@/models/building";

export const GET = async () => {
  try {
    await connectToDB();

    const buildings = await Building.aggregate([
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "building",
          as: "roomsArray",
        },
      },
      {
        $addFields: {
          rooms: { $size: "$roomsArray" },
        },
      },
      {
        $project: {
          name: 1,
          rooms: 1,
          _id: 1,
        },
      },
    ]);

    return new Response(JSON.stringify(buildings), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch all buildings " + error);
    return new Response("Failed to fetch all buildings", { status: 500 });
  }
};
