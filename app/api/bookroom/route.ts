import Day from "@/models/day"
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose"

export const POST = async (req:Request) => {
    const { dates, roomIds, bookedBy }:{dates:string[], roomIds:mongoose.Types.ObjectId[], bookedBy:string} = await req.json()

    try{
        await connectToDB()
        const formattedDates = dates.map((date) => new Date(date))

        for(const roomId of roomIds){
            for(const formattedDate of formattedDates){
                const day = await Day.findOne({date:formattedDate})
                if(day){
                    const existingBooking = day.bookedRooms.find(
                        (booking:any) => booking.room.toString() === roomId.toString()
                    )
                    if(existingBooking){
                        return new Response(`Room ${roomId} is already Booked by ${existingBooking.by} on ${formattedDate.toString()}`,{status:400})
                    }
                }
            }
        }
        
        for(const formattedDate of formattedDates){
            let day = await Day.findOne({date:formattedDate})
            if(!day){
                day = new Day({
                    date:formattedDate,
                    bookedRooms: []
                })
            }
            for(const roomId of roomIds){
                day.bookedRooms.push({
                    room:roomId,
                    by:bookedBy
                })
            }

            await day.save()
        }

        return new Response("Room(s) booked for all dates", {status: 201})
    }catch(error){
        console.log(error)
        return new Response("Failed to book room(s)", { status:500})
    }
}