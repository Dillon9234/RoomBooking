import { connectToDB } from "@/utils/database"
import Building from "@/models/building"
import Room from "@/models/room"

export const GET = async (request:Request,context:{params:{id:String}}) => {
    try{
        const { id } = await context.params

        await connectToDB()

        const building = await Building.findById(id).populate('rooms')

        return new Response(JSON.stringify(building), {status: 200})

    }catch(error){
        console.log(error)
        return new Response("Failed to fetch building", 
            {status: 500})
    }
}