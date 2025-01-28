import BookedRooms from "@/models/bookedrooms"
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose"

export const POST = async (req:Request) => {
    const {bookings}:{bookings:{date:string, roomId:mongoose.Types.ObjectId, bookedBy:string}[]} = await req.json()

    try{
        await connectToDB()

        let conflicts:{date:string, roomId:mongoose.Types.ObjectId, bookedBy:string}[]= []

        console.log(bookings)

        for(const booking of bookings){
            const formattedDate = new Date(booking.date)
            const cur = await BookedRooms.findOne({date:formattedDate, roomId: booking.roomId})
            if(cur){
                conflicts.push(booking)
            }
        }

        return new Response(JSON.stringify(conflicts), {status: 201})
    }catch(error){
        console.log(error)
        return new Response("Failed to book room(s)", { status:500})
    }
}