import { connectToDB } from "@/utils/database"
import Building from "@/models/building"
import Room from "@/models/room"

export const POST = async (req) => {
    const { number, capacity } = await req.json()
    const { id } = await context.params

    try{
        await connectToDB()

        const existingBuilding = await Building.findById(id);

        if (!existingBuilding) {
            return new Response("Building not found", { status: 404 });
        }

        const existingRoom = await Room.findOne({ number, building: id });

        if (existingRoom) {
            return new Response("Room with this number already exists in this building", { status: 400 });
        }
        

        const newRoom = new Room({
            number,
            capacity,
            building:id,
        })
        await newRoom.save()

        await Building.findByIdAndUpdate(id,{ $push: 
            { rooms: newRoom._id } },
            { new: true })        

        return new Response(JSON.stringify(newRoom), {status: 201})
    }catch(error){
        return new Response("Failed to create a new room", { status:500})
    }
}