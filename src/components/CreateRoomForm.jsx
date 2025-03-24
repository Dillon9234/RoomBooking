'use client'

import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateRoomForm = ({ isOpen, onClose, onRoomAdded, onEditRoom, onError, room }) => {
    const [submitting, setSubmitting] = useState(false);
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData(event.currentTarget);
            const number = formData.get("number");
            const capacity = formData.get("capacity");
            const buildingId = room ? room.building._id : formData.get("building");
            
            const response = await fetch(
                room ? `/api/building/${buildingId}/room/${room._id}` : `/api/building/${buildingId}/room/new`,
                {
                    method: room ? 'PATCH' : 'POST',
                    body: JSON.stringify({ number, capacity }),
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            if (response.ok) {
                const roomData = await response.json();
                room ? onEditRoom(roomData) : onRoomAdded(roomData);
                onClose();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Operation failed");
            }
        } catch (error) {
            console.log(error);
            onError?.(error.message || "An error occurred");
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
                setSelectedBuilding(room?.building?._id || data[0]?._id || "");
            } catch (error) {
                console.log(error);
            }
        };
        fetchBuildings();
    }, [room]);

    if (!isOpen) return null;
    
    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{room ? "Edit Room" : "Create New Room"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Building</label>
                                {room ? (
                                    <div className="form-control bg-light">{room.building?.name || 'Loading...'}</div>
                                ) : (
                                    <select name='building' className='form-select' value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)} required>
                                        {buildings.length > 0 ? buildings.map(building => (
                                            <option key={building._id} value={building._id}>{building.name}</option>
                                        )) : <option value="" disabled>No buildings available</option>}
                                    </select>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Number</label>
                                <input type='text' name='number' className='form-control' placeholder='Enter room number' required defaultValue={room?.number} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Capacity</label>
                                <input type='number' name='capacity' className='form-control' placeholder='Enter room capacity' min="1" required defaultValue={room?.capacity || 1} />
                            </div>
                            <div className="modal-footer">
                                <button type='button' className='btn btn-secondary' onClick={onClose}>Cancel</button>
                                <button type='submit' className='btn btn-primary' disabled={submitting}>
                                    {submitting ? (room ? "Updating..." : "Creating...") : (room ? "Update Room" : "Create Room")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRoomForm;