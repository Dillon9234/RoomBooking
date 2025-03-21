"use client"
import { useEffect, useState } from "react";
import CreateBuildingForm from "@/components/CreateBuildingForm";
import ToastMessage from "@/components/ToastMessage";

const Buildings = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState(null);
    
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await fetch("/api/building");
                if (!response.ok) throw new Error("Failed to fetch buildings");
                const data = await response.json();
                setBuildings(data);
            } catch (err) {
                setError(err.message);
                showToast(err.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchBuildings();
    }, []);

    useEffect(() => {
        if (selectedBuilding && !isEditing) {
            const handleClickOutside = (event) => {
                const dropdownElements = document.querySelectorAll('[data-dropdown-menu]');
                let clickedInsideDropdown = false;
                
                dropdownElements.forEach(element => {
                    if (element.contains(event.target)) {
                        clickedInsideDropdown = true;
                    }
                });
                
                const triggerButtons = document.querySelectorAll('[data-dropdown-trigger]');
                triggerButtons.forEach(button => {
                    if (button.contains(event.target)) {
                        clickedInsideDropdown = true;
                    }
                });
                
                if (!clickedInsideDropdown && !isEditing) {
                    setSelectedBuilding(null);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [selectedBuilding, isEditing]);

    const showToast = (message, type) => {
        setToast({ text: message, type });
    };

    const handleEditBuilding = (building) => {
        setSelectedBuilding(building);
        setIsEditing(true);
        setIsFormOpen(true);
    }

    const handleDeleteBuilding = async (building) => {
        try {
            const response = await fetch(`/api/building/${building._id}/edit`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const index = buildings.findIndex((b) => b._id === building._id);
                if (index !== -1) {
                    buildings.splice(index, 1);
                    setBuildings([...buildings]);
                    showToast(`Building "${building.name}" deleted successfully`, "success");
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete building");
            }
        } catch (error) {
            console.log(error);
            showToast(error.message || "Failed to delete building", "error");
        }
    }

    return (
        <div className="p-5 relative">
            <div className="flex justify-end px-0 py-2">
                <button
                    name="create room"
                    className="bg-white text-black px-2 py-1 flex items-center rounded-lg"
                    onClick={() => {
                        setSelectedBuilding(null);
                        setIsEditing(false);
                        setIsFormOpen(true);
                    }}
                >
                    Create
                </button>
            </div>

            {isFormOpen && (
                <CreateBuildingForm
                    isOpen={isFormOpen}
                    onClose={() => {setIsFormOpen(false); setIsEditing(false); setSelectedBuilding(null)}}
                    onBuildingAdded={(newBuilding) => {
                        setBuildings((prev) => [...prev, newBuilding]);
                        showToast(`Building "${newBuilding.name}" created successfully`, "success");
                    }}
                    onEditBuilding={(updatedBuilding) => {
                        setBuildings((prevBuildings) =>
                            prevBuildings.map((b) =>
                                b._id === updatedBuilding._id ? updatedBuilding : b
                            )
                        );
                        showToast(`Building "${updatedBuilding.name}" updated successfully`, "success");
                    }}
                    onError={(errorMessage) => {
                        showToast(errorMessage, "error");
                    }}
                    building={selectedBuilding}
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
                            <tr key={building._id || building.name}>
                                <td className="px-4 py-2">{building.name}</td>
                                <td className="px-4 py-2">{building.rooms?.length || "N/A"}</td>
                                <td className="px-4 py-2">
                                    <div className="relative inline-block">
                                        <button
                                            data-dropdown-trigger
                                            className="flex items-center justify-center p-2 bg-black hover:bg-gray-900 transition-colors rounded-lg"
                                            onClick={() =>
                                                setSelectedBuilding(selectedBuilding === building ? null : building)
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
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
                                        {selectedBuilding === building && !isEditing && (
                                            <div
                                                data-dropdown-menu
                                                role="menu"
                                                className="absolute right-0 mt-2 bg-black text-gray-100 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 p-1 shadow-md animate-in"
                                            >
                                                <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                                                <div
                                                    role="menuitem"
                                                    className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                                                    onClick={() => handleEditBuilding(building)}
                                                >
                                                    Edit
                                                </div>
                                                <div
                                                    role="menuitem"
                                                    className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                                                    onClick={() => handleDeleteBuilding(building)}
                                                >
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

            {toast && (
                <ToastMessage
                    text={toast.text}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Buildings;