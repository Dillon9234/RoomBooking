'use client'

import mongoose from 'mongoose'
import React from 'react'

const SelectedRoom = ({status, room}:{status:string, room:mongoose.Types.ObjectId}) => {

  const statusColorMap: { [key: string]: string } = {
    Available: "bg-[#38FF7E]",
    Occupied: "bg-red-600",
    default: "bg-gray-300",
  };

  const backgroundColorClass = statusColorMap[status] || statusColorMap.default;

  return (
    <div className={`${backgroundColorClass} rounded-lg aspect-square p-1 w-24 flex justify-center items-center text-black`}>
        <div>
            {status}
        </div>
    </div>
  )
}

export default SelectedRoom