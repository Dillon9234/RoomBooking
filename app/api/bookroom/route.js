import BookedRooms from "@/models/bookedrooms"
import { connectToDB } from "@/utils/database"

export const POST = async (req) => {
    const { bookings, by} = await req.json()

    try{
        if(bookings.length == 0)
            return new Response(JSON.stringify("No rooms inputted"),{status:400})
        
        const response = await fetch('http://localhost:3000/api/enquirerooms',{
            method:'POST',
            body: JSON.stringify({bookings, by})
        })

        const data = await response.json()
        
        if(data.length>0){
            return new Response(JSON.stringify(data), { status:400})
        }

        await connectToDB()
        
        for(const booking of bookings){
            const newBooking = new BookedRooms({date:booking.date, roomId:booking.roomId, by})
            newBooking.save()
        }
        return new Response("Room(s) booked for all dates", {status: 201})
    }catch(error){
        console.log(error)
        return new Response("Failed to book room(s)", { status:500})
    }
}

export const DELETE = async (req) => {
    const { bookings} = await req.json()

    try{
        console.log(bookings)
        if(bookings.length == 0)
            return new Response(JSON.stringify("No rooms inputted"),{status:400})

        await connectToDB()
        
        const deletePromises = bookings.map(async (booking) => {
            await BookedRooms.findOneAndDelete({date:booking.date,roomId:booking.roomId})
        })

        const results = await Promise.all(deletePromises);

        const deletedCount = results.filter(result => result !== null).length;

        return new Response(`Successfully deleted ${deletedCount} booking(s).`, { status: 200 });
    }catch(error){
        console.log(error)
        return new Response("Failed to delete booking(s)", { status:500})
    }
}

