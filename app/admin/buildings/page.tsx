"use client"
import { useEffect, useState} from "react";
import CreateBuildingForm from "@/components/CreateBuildingForm";
import ToastMessage from "@/components/ToastMessage";
import React from "react";
import GenericTable from "@/components/Table";

interface Building {
    _id: string;
    name: string;
    rooms: number;
    __v: number;
    [key: string]: unknown;
}

interface ToastMessage {
    text: string;
    type: "success" | "error";
}

const Buildings = (): React.JSX.Element => {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const maxBuildings = 4;
    
    useEffect(() => {
        const fetchBuildings = async (): Promise<void> => {
            try {
                const response = await fetch("/api/building");
                if (!response.ok) throw new Error("Failed to fetch buildings");
                const data = await response.json();
                setBuildings(data);
            } catch (err) {
                const error = err instanceof Error ? err.message : "An unknown error occurred";
                setError(error);
                showToast(error, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchBuildings();
    }, []);

    const showToast = (message: string, type: "success" | "error"): void => {
        setToast({ text: message, type });
    };

    const handleDeleteBuilding = async (building: Building): Promise<void> => {
        try {
            const response = await fetch(`/api/building/${building._id}/edit`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const index = buildings.findIndex((b) => b._id === building._id);
                if (index !== -1) {
                    const updatedBuildings = [...buildings];
                    updatedBuildings.splice(index, 1);
                    setBuildings(updatedBuildings);
                    showToast(`Building "${building.name}" deleted successfully`, "success");
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete building");
            }
        } catch (err) {
            console.error("Failed to delete building" + err);
            const errorMessage = err instanceof Error ? err.message : "Failed to delete building";
            showToast(errorMessage, "error");
        }
    }

    const multipleDelete = async (selectedDeletingBuildings: string[]) => {
        try {
            const updatedBuildings = [...buildings];
    
            for (const buildingId of selectedDeletingBuildings) {
                const response = await fetch(`/api/building/${buildingId}/edit`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to delete building");
                }
    
                const index = updatedBuildings.findIndex((b) => b._id === buildingId);
                if (index !== -1) {
                    updatedBuildings.splice(index, 1);
                }
            }
            setBuildings(updatedBuildings);
            showToast(`Selected building(s) deleted successfully`, "success");
        } catch (err) {
            console.error("Failed to delete building(s)" + err);
            const errorMessage = err instanceof Error ? err.message : "Failed to delete building(s)";
            showToast(errorMessage, "error");
        }
    };

    return (
        <div className="flex justify-center">
            <div className="p-5 relative max-w-screen-xl w-full">
                {isFormOpen && (
                    <CreateBuildingForm
                        isOpen={isFormOpen}
                        onClose={() => {setIsFormOpen(false); setIsEditing(false); setSelectedBuilding(null)}}
                        onBuildingAdded={(newBuilding: Building) => {
                            setBuildings((prev) => [...prev, newBuilding]);
                            showToast(`Building "${newBuilding.name}" created successfully`, "success");
                        }}
                        onEditBuilding={(updatedBuilding: Building) => {
                            setBuildings((prevBuildings) =>
                                prevBuildings.map((b) =>
                                    b._id === updatedBuilding._id ? updatedBuilding : b
                                )
                            );
                            showToast(`Building "${updatedBuilding.name}" updated successfully`, "success");
                        }}
                        onError={(errorMessage: string) => {
                            showToast(errorMessage, "error");
                        }}
                        building={selectedBuilding}
                    />
                )}
                {loading && <p>Loading buildings...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && buildings.length === 0 && <p>No buildings available</p>}
                {buildings.length > 0 && (
                    <>
                        <GenericTable
                            data={buildings}
                            selectedItem={selectedBuilding}
                            isEditing={isEditing}
                            onDeleteItem={handleDeleteBuilding} 
                            setSelectedItem={setSelectedBuilding} 
                            setIsEditing={setIsEditing} 
                            multipleDelete={multipleDelete} 
                            setIsFormOpen={setIsFormOpen} 
                            
                            maxItems={maxBuildings}                        
                        />
                    </>
                )}
                {toast && (
                    <ToastMessage
                        text={toast.text}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Buildings;
