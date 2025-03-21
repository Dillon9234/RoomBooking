import { connectToDB } from "@/utils/database"
import Building from "@/models/building"
import Room from "@/models/room"

export const PATCH = async (req,context) => {
    const { number, capacity } = await req.json()
    const { roomid } = await context.params

    try{
        await connectToDB()
        const existingRoom = await Room.findById(roomid)

        if(!existingRoom) return new Response("room not found",{status:404})

        existingRoom.number = number
        existingRoom.capacity = capacity

        await existingRoom.save()

        const populatedRoom = await Room.findById(existingRoom._id).populate("building", "name");

        return new Response(JSON.stringify(populatedRoom), {status: 201})
    }catch(error){
        return new Response("Failed to update room", { status:500})
    }
}

export const DELETE = async (req,context) => {
    const { id, roomid } = await context.params

    try{
        await connectToDB()
        const deletedRoom = await Room.findByIdAndDelete(roomid)
        
        if(!deletedRoom) return new Response("room not found",{status:404})
        
        await Building.findByIdAndUpdate(id,
            { $pull: { rooms: roomid } },
            { new: true }
        )

        return new Response("Room deleted", {status: 201})
    }catch(error){
        return new Response("Failed to delete room", { status:500})
    }
}