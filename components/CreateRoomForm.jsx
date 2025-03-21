'use client'

import React, { useState, useEffect } from 'react'

const CreateRoomForm = ({ isOpen, onClose, onRoomAdded, onEditRoom, onError, room }) => {
    const [submitting, setSubmitting] = useState(false)
    const [buildings, setBuildings] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true)

        try {
            const formData = new FormData(event.currentTarget);
            const number = formData.get("number");
            const capacity = formData.get("capacity");
            const buildingId = room ? room.building._id : formData.get("building");
            
            if(!room){
                const response = await fetch(`/api/building/${buildingId}/room/new`, {
                    method: 'POST',
                    body: JSON.stringify({ number, capacity }),
                    headers: { 'Content-Type': 'application/json' },
                })
    
                if (response.ok) {
                    const newRoom = await response.json();
                    onRoomAdded(newRoom);
                    onClose();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to create room");
                }
            } else {
                const response = await fetch(`/api/building/${buildingId}/room/${room._id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ number, capacity }),
                    headers: { 'Content-Type': 'application/json' },
                })
    
                if (response.ok) {
                    const updatedRoom = await response.json();
                    onEditRoom(updatedRoom)
                    onClose(); 
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update room");
                }
            }
            
        } catch (error) {
            console.log(error);
            if (onError) {
                onError(error.message || "An error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchBuildings = async () => {
          try {
            const response = await fetch("/api/building");
            const data = await response.json();
            setBuildings(data);
            
            if (room?.building && data.length > 0) {
              setSelectedBuilding(room.building);
            } else if (data.length > 0) {
              setSelectedBuilding(data[0]._id);
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchBuildings();
    }, [room]);

    if (!isOpen) return null;
    
    const buildingName = room?.building ? 
      buildings.find(b => b._id === room.building._id)?.name || 'Loading...' : '';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-transform duration-200 ease-out scale-100">
            <div className="bg-black p-6 rounded-xl w-96 shadow-lg border border-gray-700 relative">
                <button 
                    type='button' 
                    onClick={onClose} 
                    className='absolute top-3 right-4 text-gray-400 text-sm hover:text-white transition-colors'>
                    ✕
                </button>
                <h2 className="text-white text-xl font-semibold mb-4">
                    {room ? "Edit Room" : "Create New Room"}
                </h2>
                
                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    <div className='flex flex-col'>
                        <label className='text-white font-mono mb-1'>Building</label>
                        {room ? (
                            <div className='p-2 rounded-lg bg-gray-900 text-gray-400 border border-gray-700'>
                                {buildingName}
                                <input type="hidden" name="building" value={room.building} />
                            </div>
                        ) : (
                            <select 
                                name='building' 
                                className='p-2 rounded-lg bg-black text-white border border-gray-400'
                                value={selectedBuilding}
                                onChange={(e) => setSelectedBuilding(e.target.value)}
                                required
                            >
                                {buildings.length > 0 ? (
                                    buildings.map((building) => (
                                        <option key={building._id} value={building._id}>
                                            {building.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No buildings available</option>
                                )}
                            </select>
                        )}
                    </div>
                    
                    <div className='flex flex-col'>
                        <label className='text-white font-mono mb-1'>Number</label>
                        <input 
                            type='text' 
                            name='number' 
                            placeholder='Enter room number' 
                            className='p-2 rounded-lg bg-black text-white border border-gray-400' 
                            required 
                            defaultValue={room?.number}
                        />
                    </div>
                    
                    <div className='flex flex-col'>
                        <label className='text-white font-mono mb-1'>Capacity</label>
                        <input 
                            type='number' 
                            name='capacity' 
                            placeholder='Enter room capacity' 
                            className='p-2 rounded-lg bg-black text-white border border-gray-400' 
                            min="1"
                            required 
                            defaultValue={room?.capacity || 1}
                        />
                    </div>
                    
                    <button type='submit' className='bg-white text-black px-4 py-2 rounded-md font-mono' disabled={submitting}>
                        {submitting ? (room ? "Updating..." : "Creating...") : (room ? "Update Room" : "Create Room")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateRoomForm;