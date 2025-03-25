import BookedRooms from "@/models/bookedrooms";
import Building from "@/models/building";
import Room from "@/models/room";
import User from "@/models/user";
import mongoose, { mongo } from "mongoose";

let isConnected:boolean = false

export const connectToDB = async() => {
    mongoose.set('strictQuery',true)
    if(isConnected){
        console.log('DB already Connected')
        return
    }
    if(!process.env.MONGODB_URI){
        console.log('Mongo URI not present')
        return
    }
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: "roomBooking",
        })

        isConnected = true

        console.log('DB connected')

        await Promise.all([
            Room.init(),      
            Building.init(),  
            BookedRooms.init(),
            User.init()
          ]);
    }catch (error){
        console.log(error)
    }
}