'use client'
import Building from "@/components/Building";
import { useEffect, useState } from "react";

const BuildingList = ({data}:{data:any}) => {
  return (
    <div className="flex flex-wrap gap-10 justify-center">
      {data.map((building:any) => (
        <Building key={building.name} buildingName={building.name} buildingId={building._id}/>
      ))}
    </div>
  )
}

export default function ViewBuildings() {

  const [buildings, setBuildings] = useState([])

  useEffect(()=>{
    const fetchPosts = async () => {
      const response = await fetch('api/building')
      const data = await response.json()
      setBuildings(data)
    }
    fetchPosts()
  },[])

  return (
    <div className="flex gap-10 mx-10 my-10 justify-center">
      <BuildingList
        data={buildings}
      />
    </div>
  );
}
