import { connectToDB } from "@/utils/database"
import Room from "@/models/room"

export const GET = async () => {
    try{
        await connectToDB()

        const rooms = await Room.find({}).populate("building", "name");

        return new Response(JSON.stringify(rooms), {status: 200})

    }catch(error){
        console.error("Failed to fetch all rooms " + error)
        return new Response("Failed to fetch all rooms", 
            {status: 500})
    }
}