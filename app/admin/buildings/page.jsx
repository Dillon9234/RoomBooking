'use client'

import { useEffect, useState } from "react"
import CreateBuildingForm from "@/components/CreateBuildingForm" 

const Buildings = () => {
    const [buildings, setBuildings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedBuilding, setSelectedBuilding] = useState(null)

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await fetch('/api/building')
                if (!response.ok) throw new Error("Failed to fetch buildings")
                const data = await response.json()
                setBuildings(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchBuildings()
    }, [])

    const handleEditBuilding = (building) => {
        
    }

    const handleDeleteBuilding = async (building) => {
        try {

            const response = await fetch(`/api/building/${building._id}/edit`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (response.ok) {
                const index = buildings.findIndex((b) => b._id === building._id);
                if (index !== -1) {
                    buildings.splice(index, 1);
                    setBuildings([...buildings]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="p-5 relative">
            <div className="flex justify-end px-0 py-2">
                <button 
                    name="create room" 
                    className="bg-white text-black px-2 py-1 flex items-center rounded-lg"
                    onClick={() => setIsFormOpen(true)}
                >
                    Create
                </button>
            </div>

            {isFormOpen && (
                <CreateBuildingForm 
                    isOpen={isFormOpen} 
                    onClose={() => setIsFormOpen(false)} 
                    onBuildingAdded={(newBuilding) => setBuildings((prev) => [...prev, newBuilding])} 
                />
            )}

            {loading && <p>Loading buildings...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && buildings.length === 0 && <p>No buildings available</p>}

            {buildings.length > 0 && (
                <table className="w-full border-separate border rounded-lg border-spacing-0 border-[--border]">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-left">Building Name</th>
                            <th className="border-b px-4 py-2 text-left">Number of Rooms</th>
                            <th className="border-b px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {buildings.map((building) => (
                            <tr key={building.name}>
                                <td className="px-4 py-2">{building.name}</td>
                                <td className="px-4 py-2">{building.rooms.length || 'N/A'}</td>
                                <td className="px-4 py-2">
                                    <div className="relative inline-block">
                                        <button 
                                            className="flex items-center justify-center p-2 bg-black hover:bg-gray-900 transition-colors rounded-lg"
                                            onClick={() => setSelectedBuilding(selectedBuilding === building ? null : building)}
                                        >
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="24" height="24" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                className="h-4 w-4 text-white"
                                            >
                                                <circle cx="12" cy="12" r="1"></circle>
                                                <circle cx="19" cy="12" r="1"></circle>
                                                <circle cx="5" cy="12" r="1"></circle>
                                            </svg>
                                        </button>
                                        {selectedBuilding === building && (
                                            <div 
                                                role="menu" 
                                                className="absolute right-0 mt-2 bg-black text-gray-100 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 p-1 shadow-md animate-in"
                                            >
                                                <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                                                <div 
                                                    role="menuitem" 
                                                    className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                                                    onClick={() => handleEditBuilding(building)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen mr-2 h-4 w-4">
                                                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                                                    </svg>
                                                    Edit
                                                </div>
                                                <div 
                                                    role="menuitem" 
                                                    className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                                                    onClick={() => handleDeleteBuilding(building)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash mr-2 h-4 w-4">
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14c0 1-1 1-1 1H6c0 0-1 0-1-1V6"></path>
                                                        <path d="M10 11v6"></path>
                                                        <path d="M14 11v6"></path>
                                                        <path d="M4 6l1-2h14l1 2"></path>
                                                    </svg>
                                                    Delete
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Buildings