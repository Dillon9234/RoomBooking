"use client"
import { useEffect, useState } from "react";
import ToastMessage from "../../components/ToastMessage";
import CreateRoomForm from "../../components/CreateRoomForm";
import "bootstrap/dist/css/bootstrap.min.css";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState(null);
    
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/rooms");
                if (!response.ok) throw new Error("Failed to fetch rooms");
                const data = await response.json();
                setRooms(data);
            } catch (err) {
                setError(err.message);
                showToast(err.message, "danger");
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const showToast = (message, type) => {
        setToast({ text: message, type });
    };

    const handleEditRoom = (room) => {
        setSelectedRoom(room);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const handleDeleteRoom = async (room) => {
        try {
            const response = await fetch(`/api/building/${room.building._id}/room/${room._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setRooms(rooms.filter((b) => b._id !== room._id));
                showToast(`Room deleted successfully`, "success");
            } else {
                throw new Error("Failed to delete room");
            }
        } catch (error) {
            showToast(error.message || "Failed to delete room", "danger");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => {
                    setSelectedRoom(null);
                    setIsEditing(false);
                    setIsFormOpen(true);
                }}>
                    Create Room
                </button>
            </div>

            {isFormOpen && (
                <CreateRoomForm
                    isOpen={isFormOpen}
                    onClose={() => {setIsFormOpen(false); setIsEditing(false); setSelectedRoom(null);}}
                    onRoomAdded={(newRoom) => {
                        setRooms([...rooms, newRoom]);
                        showToast(`Room created successfully`, "success");
                    }}
                    onEditRoom={(updatedRoom) => {
                        setRooms(rooms.map((b) => (b._id === updatedRoom._id ? updatedRoom : b)));
                        showToast(`Room updated successfully`, "success");
                    }}
                    onError={(errorMessage) => showToast(errorMessage, "danger")}
                    room={selectedRoom}
                />
            )}

            {loading && <p>Loading rooms...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && rooms.length === 0 && <p>No rooms available</p>}

            {rooms.length > 0 && (
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Room Number</th>
                            <th>Capacity</th>
                            <th>Building Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id || room.name}>
                                <td>{room.number}</td>
                                <td>{room.capacity}</td>
                                <td>{room.building.name}</td>
                                <td>
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-warning" onClick={() => handleEditRoom(room)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRoom(room)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {toast && (
                <ToastMessage text={toast.text} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
};

export default Rooms;
