'use client'

import mongoose from "mongoose";
import { useEffect, useState } from "react";

const BookRoom = ({ buildingId, roomNumber, roomId  }: { buildingId:mongoose.Types.ObjectId, roomNumber: number, roomId:mongoose.Types.ObjectId}) => {
    const [isBooked, setIsBooked] = useState(false)
    const [clubName, setClubName] = useState('')
    const [time, setTime] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response:Response = await fetch(`/api/${buildingId}/room/${roomId}`);
            const data = await response.json()
            if(data.isBooked){
                setIsBooked(true)
                setClubName(data.clubName)
                setTime(data.time)
            }else{
                setIsBooked(false)
            }
          }
          fetchPosts()
    },[])
    

    return (
      <div className="
      bg-white 
      h-40 
      w-40 
      text-black
      rounded-md
      flex
      flex-col
      items-center
      justify-center
      font-mono">
        <div className="text-lg">
            {roomNumber}
        </div>
        {isBooked ? (
            <>
                <div>
                    {clubName}
                </div>
                <div>
                    {time}
                </div>
            </>
        ):(
            <>
            </>
        )}
        
        
        
      </div>
    );
  };
  
  export default BookRoom;