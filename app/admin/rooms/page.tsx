"use client"

import { SetStateAction, useEffect, useState } from "react";
import ToastMessage from "@/components/ToastMessage";
import CreateRoomForm from "@/components/CreateRoomForm";
import GenericTable from "@/components/Table";

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

interface Toast {
  text: string;
  type: "success" | "error" | "info";
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsDeconstructed, setRoomsDeconstructed] = useState<RoomDeconstructed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomDeconstructed | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const maxRooms = 10;
    
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        if (!response.ok) throw new Error("Failed to fetch buildings");
        const data: Room[] = await response.json();
        setRooms(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!rooms.length) return;

    const transformedRooms = rooms.map((room) => ({
        _id: room._id,
        number: room.number,
        capacity: room.capacity,
        buildingId: room.building?._id || "",
        buildingName: room.building?.name || "Unknown",
    }));

    setRoomsDeconstructed(transformedRooms);
  }, [rooms]);

  useEffect(() => {
    if (selectedRoom && !isEditing) {
      const handleClickOutside = (event: MouseEvent) => {
        const dropdownElements = document.querySelectorAll('[data-dropdown-menu]');
        let clickedInsideDropdown = false;
                
        dropdownElements.forEach(element => {
          if (element.contains(event.target as Node)) {
            clickedInsideDropdown = true;
          }
        });
                
        const triggerButtons = document.querySelectorAll('[data-dropdown-trigger]');
        triggerButtons.forEach(button => {
          if (button.contains(event.target as Node)) {
            clickedInsideDropdown = true;
          }
        });
                
        if (!clickedInsideDropdown && !isEditing) {
            setSelectedRoom(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [selectedRoom, isEditing]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ text: message, type });
  };

  const handleDeleteRoom = async (room: RoomDeconstructed) => {
    try {
      const response = await fetch(`/api/building/${room.buildingId}/room/${room._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const index = rooms.findIndex((b) => b._id === room._id);
        if (index !== -1) {
          const updatedRooms = [...rooms];
          updatedRooms.splice(index, 1);
          setRooms(updatedRooms);
          showToast(`Room deleted successfully`, "success");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete building");
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete building";
      showToast(errorMessage, "error");
    }
  }

  const multipleDelete = async (selectedDeletingRooms: string[]) => {
    try {
        const updatedRooms = [...rooms];
        
        for (const roomId of selectedDeletingRooms) {
            const room =  rooms.find((room) => room._id == roomId)
            const response = await fetch(`/api/building/${room?.building._id}/room/${roomId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete room");
            }

            const index = updatedRooms.findIndex((b) => b._id === roomId);
            if (index !== -1) {
                updatedRooms.splice(index, 1);
            }
        }
        setRooms(updatedRooms);
        showToast(`Selected room(s) deleted successfully`, "success");
    } catch (err) {
        console.log(err);
        const errorMessage = err instanceof Error ? err.message : "Failed to delete room(s)";
        showToast(errorMessage, "error");
    }
};

  return (
    <div className="flex justify-center">
      <div className="p-5 relative max-w-screen-xl w-full">
        {isFormOpen && (
          <CreateRoomForm
            isOpen={isFormOpen}
            onClose={() => {setIsFormOpen(false); setIsEditing(false); setSelectedRoom(null)}}
            onRoomAdded={(newRoom: Room) => {
              setRooms((prev) => [...prev, newRoom]);
              showToast(`Room created successfully`, "success");
            }}
            onEditRoom={(updatedRoom: Room) => {
              setRooms((prevRooms) =>
                prevRooms.map((b) =>
                  b._id === updatedRoom._id ? updatedRoom : b
                )
              );
              showToast(`Room updated successfully`, "success");
            }}
            onError={(errorMessage: string) => {
              showToast(errorMessage, "error");
            }}
            room={selectedRoom}
          />
        )}
        {loading && <p>Loading rooms...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && rooms.length === 0 && <p>No rooms available</p>}
        {rooms.length > 0 && (
            <GenericTable 
            data={roomsDeconstructed} 
            selectedItem={selectedRoom}
            isEditing={isEditing}
            onDeleteItem={handleDeleteRoom} 
            setSelectedItem={setSelectedRoom} 
            setIsEditing={setIsEditing} 
            multipleDelete={multipleDelete} 
            setIsFormOpen={setIsFormOpen} 
            maxItems={maxRooms}
            excludeFields={['_id','__v','buildingId']}
            />
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

export default Rooms;
