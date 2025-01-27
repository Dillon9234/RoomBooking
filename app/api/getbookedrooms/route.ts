import { connectToDB } from "@/utils/database"
import Day from "@/models/day"

export const GET = async (request:Request) => {
    try{
        await connectToDB()

        const days = await Day.find({}).populate('bookedRooms.room')

        return new Response(JSON.stringify(days), {status: 200})

    }catch(error){
        console.log(error)
        return new Response("Failed to fetch all days", 
            {status: 500})
    }
}