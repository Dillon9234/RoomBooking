'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmBox from './ConfirmBox'
import ToastMessage from './ToastMessage'


const CreateRoomForm = () => {
    const [submitting, setSubmitting] = useState(false)

    const [buildings, setBuildings] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState('')
    const [roomName,setRoomName] = useState(null)

    const [toast, setToast] = useState(null);
    
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


    const handleChangeBuilding = (event) => {
        setSelectedBuilding(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(submitting)
            return
        setSubmitting(true)
        try {
            if (!selectedBuilding) {
              throw new Error("No building selected.");
            }
            let response;
            const roomName = nameInput?.current?.value;
            response = await fetch("/api/bookroom", {
            method: "POST",
            body: JSON.stringify({
                bookings: selectedRoomsRef.current,
                by: bookedBy,
            }),
            });
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText || "Failed to process request.");
            }
            setToast({
              text: state === 1 ? "Booked successfully!" : "Deleted successfully!",
              type: "success",
            });
          } catch (error) {
            setToast({ text: error.message, type: "error" });
          } finally {
            setSubmitting(false);
          }
    };
  return (
        <form onSubmit={handleSubmit} 
        className='w-full flex flex-col gap-2 font-mono bg-black'>
            <div className='w-full flex flex-row gap-10 justify-evenly md:justify-normal'>
                <div className='flex flex-col justify-center items-center'>
                    <label className='block text-white font-mono py-2'>
                        Building
                    </label>
                    <select name="building" value={selectedBuilding} id="buildingDropdown" onChange={handleChangeBuilding}
                        className='bg-[#6c8cff] text-black border rounded-lg h-10 p-2 block border-black
                        focus:ring-[#006eff] focus:border-[#006eff] border-collapse'>
                            <option defaultValue={undefined}>
                                Select
                            </option>
                        {buildings && buildings.map((building) => (
                            <option key={building._id}value={building._id}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="py-2 w-52">
            <input
              type="text"
              className="max-w-max flex h-10 rounded-lg bg-[#282828]
                    text-[#8b8b8b] px-2"
              maxLength={10}
              placeholder="Number"
              ref={roomName}
            />
            </div>
            <div>
            </div>
            {toast && <ToastMessage 
            text={toast.text}
            type={toast.type}
            onClose={() => setToast(null)}
            />}
            
        </form>
  )
}

export default CreateRoomForm