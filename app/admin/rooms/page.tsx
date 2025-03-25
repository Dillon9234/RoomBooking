"use client"

import { useEffect, useState } from "react";
import ToastMessage from "@/components/ToastMessage";
import CreateRoomForm from "@/components/CreateRoomForm";

interface Room {
  _id: string;
  number: string;
  capacity: number;
  building: {
    _id: string;
    name: string;
  };
}

interface Toast {
  text: string;
  type: "success" | "error" | "info";
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);
    
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
            setSelectedRoom(undefined);
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

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditing(true);
    setIsFormOpen(true);
  }

  const handleDeleteRoom = async (room: Room) => {
    try {
      const response = await fetch(`/api/building/${room.building._id}/room/${room._id}`, {
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

  return (
    <div className="p-5 relative">
      <div className="flex justify-end px-0 py-2">
        <button
          name="create room"
          className="bg-white text-black px-2 py-1 flex items-center rounded-lg"
          onClick={() => {
            setSelectedRoom(undefined);
            setIsEditing(false);
            setIsFormOpen(true);
          }}
        >
          Create
        </button>
      </div>

      {isFormOpen && (
        <CreateRoomForm
          isOpen={isFormOpen}
          onClose={() => {setIsFormOpen(false); setIsEditing(false); setSelectedRoom(undefined)}}
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
        <table className="w-full border-separate border rounded-lg border-spacing-0 border-[--border]">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Room Number</th>
              <th className="border-b px-4 py-2 text-left">Capacity</th>
              <th className="border-b px-4 py-2 text-left">Building Name</th>
              <th className="border-b px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id || room.number}>
                <td className="px-4 py-2">{room.number}</td>
                <td className="px-4 py-2">{room.capacity}</td>
                <td className="px-4 py-2">{room.building.name}</td>
                <td className="px-4 py-2">
                  <div className="relative inline-block">
                    <button
                      data-dropdown-trigger
                      className="flex items-center justify-center p-2 bg-black hover:bg-gray-900 transition-colors rounded-lg"
                      onClick={() =>
                        setSelectedRoom(selectedRoom === room ? undefined : room)
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
                    {selectedRoom === room && !isEditing && (
                      <div
                        data-dropdown-menu
                        role="menu"
                        className="absolute right-0 mt-2 bg-black text-gray-100 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 p-1 shadow-md animate-in"
                      >
                        <div className="px-2 py-1.5 text-sm font-semibold">Actions</div>
                        <div
                          role="menuitem"
                          className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                          onClick={() => handleEditRoom(room)}
                        >
                          Edit
                        </div>
                        <div
                          role="menuitem"
                          className="hover:bg-gray-700 hover:text-gray-200 flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                          onClick={() => handleDeleteRoom(room)}
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

export default Rooms;
