import Building from "@/models/building";
import Day from "@/models/day";
import Room from "@/models/room";
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
            Day.init(),
          ]);
    }catch (error){
        console.log(error)
    }
}