'use client'

import React, { useState, useEffect, FormEvent } from 'react'

interface Building {
    _id: string;
    name: string;
}

interface Room {
    _id: string;
    number: string;
    capacity: number;
    building: {
        _id: string;
        name: string;
    };
}

interface RoomDeconstructed extends Omit<Room, "building"> {
    buildingId: string;
    buildingName: string;
}

interface CreateRoomFormProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomAdded: (room: Room) => void;
    onEditRoom: (room: Room) => void;
    onError?: (message: string) => void;
    room: RoomDeconstructed | null;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ isOpen, onClose, onRoomAdded, onEditRoom, onError, room }) => {
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [buildings, setBuildings] = useState<Building[]>([])
    const [selectedBuilding, setSelectedBuilding] = useState<string>("")

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true)

        try {
            const formData = new FormData(event.currentTarget);
            const number = formData.get("number") as string;
            const capacity = formData.get("capacity") as string;
            const buildingId = room ? room.buildingId : formData.get("building") as string;
            
            if(!room){
                const response = await fetch(`/api/building/${buildingId}/room/new`, {
                    method: 'POST',
                    body: JSON.stringify({ number, capacity }),
                    headers: { 'Content-Type': 'application/json' },
                })
    
                if (response.ok) {
                    const newRoom: Room = await response.json();
                    onRoomAdded(newRoom);
                    onClose();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to create room");
                }
            } else {
                const response = await fetch(`/api/building/${buildingId}/room/${room._id}/edit`, {
                    method: 'PATCH',
                    body: JSON.stringify({ number, capacity }),
                    headers: { 'Content-Type': 'application/json' },
                })
    
                if (response.ok) {
                    const updatedRoom: Room = await response.json();
                    onEditRoom(updatedRoom)
                    onClose(); 
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update room");
                }
            }
            
        } catch (error) {
            console.error("An error occurred "+ error);
            if (onError) {
                onError((error as Error).message || "An error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchBuildings = async () => {
          try {
            const response = await fetch("/api/building");
            const data: Building[] = await response.json();
            setBuildings(data);
            
            if (room && data.length > 0) {
              setSelectedBuilding(room.buildingId);
            } else if (data.length > 0) {
              setSelectedBuilding(data[0]._id);
            }
          } catch (error) {
            console.error("Error fetching buildings " + error);
          }
        };
        fetchBuildings();
    }, [room]);

    if (!isOpen) return null;
    
    const buildingName = room ? 
      buildings.find(b => b._id === room.buildingId)?.name || 'Loading...' : '';

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
                                <input type="hidden" name="building" value={room.buildingId} />
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