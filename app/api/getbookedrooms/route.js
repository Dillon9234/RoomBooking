import BookedRooms from "@/models/bookedrooms"
import { connectToDB } from "@/utils/database"

export const GET = async (request) => {
    try{
        await connectToDB()

        const bookedRooms = await BookedRooms.find({})

        return new Response(JSON.stringify(bookedRooms), {status: 200})

    }catch(error){
        console.log(error)
        return new Response("Failed to fetch all days", 
            {status: 500})
    }
}