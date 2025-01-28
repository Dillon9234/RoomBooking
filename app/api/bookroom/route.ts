import BookedRooms from "@/models/bookedrooms"
import Day from "@/models/bookedrooms"
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose"

export const POST = async (req:Request) => {
    const { bookings}:{bookings:{date:string, roomId:mongoose.Types.ObjectId, bookedBy:string}[]} = await req.json()

    try{
        if(bookings.length == 0)
            return new Response(JSON.stringify("No rooms inputted"),{status:400})
        
        const response = await fetch('http://localhost:3000/api/enquirerooms',{
            method:'POST',
            body: JSON.stringify({bookings})
        })

        const data = await response.json()
        
        if(data.length>0){
            return new Response(JSON.stringify(data), { status:400})
        }

        await connectToDB()
        
        for(const booking of bookings){
            const newBooking = new BookedRooms(booking)
            newBooking.save()
        }
        return new Response("Room(s) booked for all dates", {status: 201})
    }catch(error){
        console.log(error)
        return new Response("Failed to book room(s)", { status:500})
    }
}