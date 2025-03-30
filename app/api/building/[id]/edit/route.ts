import { connectToDB } from "@/utils/database"
import Building from "@/models/building"

export const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { name }:{name:string} = await req.json()

    try{
        await connectToDB()
        const existingBuilding = await Building.findById(id)

        if(!existingBuilding) return new Response("Building not found",{status:404})

        existingBuilding.name = name

        await existingBuilding.save()

        return new Response(JSON.stringify(existingBuilding), {status: 201})
    }catch(error){
        console.error("Failed to update building"+ error)
        return new Response("Failed to update building", { status:500})
    }
}

export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
  
    try {
      await connectToDB();
      await Building.findByIdAndDelete(id);
  
      return new Response("Building deleted", { status: 201 });
    } catch (error) {
      console.error("Failed to delete building" + error);
      return new Response("Failed to delete building", { status: 500 });
    }
  }
  