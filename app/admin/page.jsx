'use client'

import CreateBuildingForm from "@/components/CreateBuildingForm"
import CreateRoomForm from "@/components/CreateRoomForm"
import { useEffect, useState } from "react"

const building = () => {

    const [buildings, setBuildings] = useState([])

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await fetch('/api/building')
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
        <CreateBuildingForm></CreateBuildingForm>
        <CreateRoomForm/>
    </div>
    
  )
}

export default building