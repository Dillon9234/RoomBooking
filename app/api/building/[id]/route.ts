import { connectToDB } from "@/utils/database";
import Building from "@/models/building";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    await connectToDB();

    const building = await Building.findById(id).populate("rooms");

    return new Response(JSON.stringify(building), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch building " + error);
    return new Response("Failed to fetch building", { status: 500 });
  }
};
