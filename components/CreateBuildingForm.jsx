'use client'

import React, { useState } from 'react'

const CreateBuildingForm = ({ isOpen, onClose, onBuildingAdded, onEditBuilding, onError, building }) => {
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true)

        try {
            const formData = new FormData(event.currentTarget);
            const name = formData.get("name");
            
            if(!building){
                const response = await fetch('/api/building/new', {
                    method: 'POST',
                    body: JSON.stringify({ name }),
                    headers: { 'Content-Type': 'application/json' },
                })
    
                if (response.ok) {
                    const newBuilding = await response.json();
                    onBuildingAdded(newBuilding);
                    onClose();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to create building");
                }
            } else {
                const response = await fetch(`/api/building/${building._id}/edit`, {
                    method: 'PATCH',
                    body: JSON.stringify({ name }),
                    headers: { 'Content-Type': 'application/json' },
                })
    
                if (response.ok) {
                    const updatedBuilding = await response.json();
                    onEditBuilding(updatedBuilding)
                    onClose(); 
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update building");
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

    if (!isOpen) return null;

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
                    {building ? "Edit Building" : "Create New Building"}
                </h2>
                
                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    <div className='flex flex-col'>
                        <label className='text-white font-mono mb-1'>Name</label>
                        <input type='text' name='name' placeholder='Enter building name' className='p-2 rounded-lg bg-black text-white border border-gray-400' required 
                        defaultValue={building?.name}/>
                    </div>
                    <button type='submit' className='bg-white text-black px-4 py-2 rounded-md font-mono' disabled={submitting}>
                        {submitting ? (building ? "Updating..." : "Creating...") : (building ? "Update Building" : "Create Building")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateBuildingForm;