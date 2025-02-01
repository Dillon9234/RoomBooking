import CreateBuildingForm from '@/components/CreateBuildingForm'
import CreateRoomForm from '@/components/CreateRoomForm'
import React from 'react'

const admindashboard = () => {
  return (
    <div className="p-5 text-white">
      <div className="font-bold text-[#b2bbff] flex justify-center md:justify-normal">ADMIN DASHBOARD</div>
      <CreateBuildingForm/>
    </div>
  )
}

export default admindashboard