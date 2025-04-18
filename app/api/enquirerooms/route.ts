import BookedRooms from "@/models/bookedrooms"
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose"

export const POST = async (req:Request) => {
    const {bookings, by}:{bookings:{date:string, roomId:mongoose.Types.ObjectId}[], by:string} = await req.json()

    try{
        await connectToDB()

        const conflicts:{date:string, roomId:mongoose.Types.ObjectId, bookedBy:string}[]= []

        if(bookings.length == 0)
            return new Response(JSON.stringify("No rooms inputted"),{status:400})

        for(const booking of bookings){
            const cur = await BookedRooms.findOne({date:booking.date, roomId: booking.roomId})
            if(cur){
                conflicts.push({date:booking.date,roomId:booking.roomId,bookedBy:by})
            }
        }

        return new Response(JSON.stringify(conflicts), {status: 201})
    }catch(error){
        console.error("Failed to enuire room(s) "+error)
        return new Response("Failed to enuire room(s)", { status:500})
    }
}