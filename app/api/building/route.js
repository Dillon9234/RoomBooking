import { connectToDB } from "@/utils/database"
import Building from "@/models/building"

export const GET = async () => {
    try{
        await connectToDB()

        const buildings = await Building.find({}).populate('rooms')

        return new Response(JSON.stringify(buildings), {status: 200})

    }catch(error){
        console.log(error)
        return new Response("Failed to fetch all buildings", 
            {status: 500})
    }
}