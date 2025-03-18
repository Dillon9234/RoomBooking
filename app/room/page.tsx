'use client'

import mongoose from "mongoose"
import { useEffect, useState } from "react"

const rooms = () => {

    const [buildings, setBuildings] = useState<{_id:mongoose.Types.ObjectId,name:string,rooms: mongoose.Types.ObjectId[]}[]>([])

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response:Response = await fetch('/api/building')
                const data = await response.json()
                setBuildings(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchBuildings()
    }, [])


  return (
    <div className="flex flex-wrap gap-10 p-10 justify-center">
        {buildings?.length>0? (
            buildings.map((building) =>(
                <div key={building.name} className="bg-white text-black aspect-square
                 w-28 h-28 rounded-lg
                 flex items-center justify-center">
                    {building.name}
                </div>
            ))
        )
        :<></>}
    </div>
    
  )
}

export default rooms