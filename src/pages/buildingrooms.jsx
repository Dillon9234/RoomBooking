"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal, Spinner, Alert } from "react-bootstrap";
import CreateRoomForm from "../components/CreateRoomForm"; // Assume this exists

const BuildingRooms = () => {
    const { buildingId } = useParams(); // ✅ Extract building ID from URL
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchBuildingRooms = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/building/${buildingId}/rooms`);

                if (!response.ok) throw new Error("Failed to fetch building rooms");

                const data = await response.json();
                setBuilding(data.building);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (buildingId) fetchBuildingRooms();
    }, [buildingId]);

    const handleDeleteRoom = async (roomId) => {
        try {
            const response = await fetch(`/api/building/${buildingId}/room/${roomId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete room");

            // Remove the deleted room from state
            setBuilding((prev) => ({
                ...prev,
                rooms: prev.rooms.filter((room) => room._id !== roomId),
            }));
        } catch (error) {
            console.error("Delete Room Error:", error);
            setError(error.message);
        }
    };

    const handleEditRoom = (updatedRoom) => {
        setBuilding((prev) => ({
            ...prev,
            rooms: prev.rooms.map((room) => (room._id === updatedRoom._id ? updatedRoom : room)),
        }));
    };

    const handleAddRoom = (newRoom) => {
        setBuilding((prev) => ({
            ...prev,
            rooms: [...prev.rooms, newRoom],
        }));
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>{building?.name} - Rooms</h1>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setSelectedRoom(null);
                            setShowRoomModal(true);
                        }}
                    >
                        Add New Room
                    </Button>
                </Col>
            </Row>

            {building?.rooms?.length === 0 ? (
                <Alert variant="info">No rooms found in this building.</Alert>
            ) : (
                <Row xs={1} md={3} className="g-4">
                    {building.rooms.map((room) => (
                        <Col key={room._id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Room {room.number}</Card.Title>
                                    <Card.Text>Capacity: {room.capacity} people</Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedRoom(room);
                                                setShowRoomModal(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteRoom(room._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Room Creation/Edit Modal */}
            <CreateRoomForm
                isOpen={showRoomModal}
                onClose={() => setShowRoomModal(false)}
                onRoomAdded={handleAddRoom}
                onEditRoom={handleEditRoom}
                onError={setError}
                room={selectedRoom}
                buildingId={buildingId}
            />
        </Container>
    );
};

export default BuildingRooms;
