'use client'

import mongoose from 'mongoose'
import React, { useEffect, useState } from 'react'

const SelectedRoom = ({status, room, setSelected}:{status:string, room:mongoose.Types.ObjectId, setSelected: (isSelected:boolean) => void}) => {

  const [curStatus, setCurStatus] = useState('')

  const [backgroundColorClass, setBackgroundColorClass] = useState('')

  const statusColorMap: { [key: string]: string } = {
    Selected: "bg-[#4b7dff]",
    Occupied: "bg-[#3f3f3f]",
    Unselected: "bg-[#8b8b8b]",
  };

  useEffect(() => {
    setCurStatus(status)
  },[status])

  useEffect(() => {
    setBackgroundColorClass(statusColorMap[curStatus])
  },[curStatus])

  const handleClick = () => {
    if(curStatus === 'Occupied') 
      return; 
    else if(curStatus==='Selected'){
      setCurStatus('Unselected')
      setSelected(false)
    }
    else {
      setCurStatus('Selected')
      setSelected(true)
    }
  }


  return (
    <div className={`${backgroundColorClass} rounded-lg aspect-square p-1 w-24 flex justify-center items-center text-black cursor-pointer`}
      onClick={handleClick}>
        <div>
          {/* {curStatus === 'Occupied' && "Occupied"} */}
        </div>
    </div>
  )
}

export default SelectedRoom