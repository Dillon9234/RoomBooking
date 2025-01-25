'use client'
import Room from "@/components/Room";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RoomList = ({data}:{data:any}) => {
  return (
    <div className="flex flex-wrap gap-10 justify-center">
      {data.map((room:any) => (
        <Room key={room.number} roomNumber={room.number}/>
      ))}
    </div>
  )
}

export default function ViewRoomsInBuilding() {
  const { id } = useParams()
  const [rooms, setRooms] = useState([])
  useEffect(()=>{
    const fetchPosts = async () => {
      const response = await fetch(`/api/building/${id}`)
      const data = await response.json()
      setRooms(data.rooms)
    }
    fetchPosts()
  },[])

  return (
    <div className="flex gap-10 mx-10 my-10 justify-center">
        <RoomList
        data={rooms}
        />
    </div>
  );
}
