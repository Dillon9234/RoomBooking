import BookingForm from '@/components/BookingForm'
import React from 'react'

const admindashboard = () => {
  return (
    <div className="p-5 text-white">
      <div className="flex text-5xl py-4 justify-center md:justify-normal">
        Room Booking
      </div>
      <BookingForm/>
    </div>
  )
}

export default admindashboard