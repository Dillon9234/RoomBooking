'use client'

import mongoose from 'mongoose'
import React from 'react'

const SelectedRoom = ({roomNumber, room}:{roomNumber:number, room:mongoose.Types.ObjectId}) => {
  return (
    <div className='bg-gray-300 rounded-lg aspect-square p-1 w-24 flex justify-center items-center'>
        <div>
            {roomNumber}
        </div>
    </div>
  )
}

export default SelectedRoom