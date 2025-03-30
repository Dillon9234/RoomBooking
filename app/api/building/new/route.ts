import { connectToDB } from "@/utils/database"
import Building from "@/models/building"

export const POST = async (req:Request) => {
    const { name }:{name:string} = await req.json()

    try{
        await connectToDB()
        const existingBuilding = await Building.findOne({name})
        if(existingBuilding) return new Response("Buidling already exists", { status:403})
        const newBuilding = new Building({
            name,
        })

        await newBuilding.save()

        return new Response(JSON.stringify(newBuilding), {status: 201})
    }catch(error){
        console.error("Failed to create a new building "+ error)
        return new Response("Failed to create a new building", { status:500})
    }
}