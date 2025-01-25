'use client'
import Room from "@/components/Room";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RoomList = ({data, buildingId}:{data:any, buildingId:mongoose.Types.ObjectId}) => {
  return (
    <div className="mt-10 flex gap-10 mx-20 my-20 ">
      {data.map((room:any) => (
        <Room key={room.number} buildingId={buildingId} roomNumber={room.number} roomId={room._id}/>
      ))}
    </div>
  )
}

export default function ViewRoomsInBuilding() {
  const { id } = useParams()
  const [rooms, setRooms] = useState([])
  const buildingId = id && typeof id === "string" ? new mongoose.Types.ObjectId(id) : undefined;
  useEffect(()=>{
    const fetchPosts = async () => {
      const response = await fetch(`/api/building/${id}`)
      const data = await response.json()
      setRooms(data.rooms)
    }
    fetchPosts()
  },[])

  return (
    <div className="flex gap-10 mx-20 my-20">
      {
        buildingId ? <RoomList
        data={rooms}
        buildingId={buildingId}
        />:
        <></>
      }
      
    </div>
  );
}
