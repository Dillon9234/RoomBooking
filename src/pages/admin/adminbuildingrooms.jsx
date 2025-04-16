"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import CreateRoomForm from "../../components/CreateRoomForm";
import { Link } from "react-router-dom";
import {
  BsDoorOpen,
  BsPeople,
  BsArrowLeft,
  BsPlusCircle,
} from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};


// Card hover effect styles
const cardStyle = {
  transition: "all 0.3s ease",
  backgroundColor: "#2a2a2a",
  border: "none",
  borderRadius: "10px",
  overflow: "hidden",
};

const cardHoverStyle = {
  transform: "translateY(-10px)",
  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
};

const AdminBuildingRooms = () => {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {

    const token = getCookie("token"); // Fetch token from cookie
    let isAdmin = false;
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
      return;
    }

  }, []);

  useEffect(() => {
    const fetchBuildingRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/building/${buildingId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch building rooms");

        const data = await response.json();

        if (data && data.building) {
          if (!data.building.rooms) {
            data.building.rooms = [];
          }
          setBuilding(data.building);
        } else if (data) {
          if (!data.rooms) {
            data.rooms = [];
          }
          setBuilding(data);
        } else {
          throw new Error("Invalid response format");
        }
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
      const response = await fetch(
        `http://localhost:3000/api/building/${buildingId}/room/${roomId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete room");

      setBuilding((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          rooms: prev.rooms.filter((room) => room._id !== roomId),
        };
      });
    } catch (error) {
      console.error("Delete Room Error:", error);
      setError(error.message);
    }
  };

  const handleEditRoom = (updatedRoom) => {
    setBuilding((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        rooms: prev.rooms.map((room) =>
          room._id === updatedRoom._id ? updatedRoom : room
        ),
      };
    });
  };

  const handleAddRoom = (newRoom) => {
    setBuilding((prev) => {
      if (!prev) return { rooms: [newRoom] };
      return {
        ...prev,
        rooms: [...(prev.rooms || []), newRoom],
      };
    });
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading building details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="shadow-sm">
          <Alert.Heading>Error Loading Building</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/buildings" className="btn btn-outline-danger">
              Return to Buildings
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!building) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="shadow-sm">
          <Alert.Heading>Building Not Found</Alert.Heading>
          <p>The requested building could not be found or loaded.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/buildings" className="btn btn-outline-warning">
              Return to Buildings
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="py-4 px-4"
      style={{ backgroundColor: "#212529", minHeight: "100vh" }}
    >
      <Link
        to="/admin/buildings"
        className="btn btn-outline-light mb-4 d-inline-flex align-items-center"
      >
        <BsArrowLeft className="me-2" /> Back to Buildings
      </Link>

      <div className="bg-dark p-4 rounded-3 shadow-lg mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="display-5 fw-bold text-white">
              {building.name || "Building"}
            </h1>
            <p className="lead text-light opacity-75">
              {building.rooms?.length || 0} Room
              {building.rooms?.length !== 1 ? "s" : ""} Available
            </p>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              size="lg"
              className="d-flex align-items-center"
              onClick={() => {
                setSelectedRoom(null);
                setShowRoomModal(true);
              }}
            >
              <BsPlusCircle className="me-2" /> Add New Room
            </Button>
          </Col>
        </Row>
      </div>

      {!building.rooms || building.rooms.length === 0 ? (
        <Alert variant="info" className="shadow-sm">
          <div className="d-flex align-items-center">
            <BsDoorOpen className="me-3" size={24} />
            <div>
              <Alert.Heading>No Rooms Available</Alert.Heading>
              <p className="mb-0">
                This building doesn't have any rooms yet. Add a new room to get
                started.
              </p>
            </div>
          </div>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {building.rooms.map((room) => (
            <Col key={room._id}>
              <Card
                className="h-100 shadow"
                style={{
                  ...cardStyle,
                  ...(hoveredCard === room._id ? cardHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredCard(room._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card.Body className="d-flex flex-column text-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge bg="primary" pill className="px-3 py-2 fs-6">
                      Room {room.number}
                    </Badge>
                    <Badge
                      bg="secondary"
                      pill
                      className="d-flex align-items-center px-3 py-2"
                    >
                      <BsPeople className="me-1" /> {room.capacity}
                    </Badge>
                  </div>

                  <Card.Title className="fs-4 mb-3">
                    Room {room.number}
                  </Card.Title>

                  <Card.Text className="text-light opacity-75 mb-4">
                    This room can accommodate up to {room.capacity}{" "}
                    {room.capacity === 1 ? "person" : "people"}.
                  </Card.Text>

                  <div className="mt-auto d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      className="flex-grow-1"
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowRoomModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="flex-grow-1"
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

export default AdminBuildingRooms;
