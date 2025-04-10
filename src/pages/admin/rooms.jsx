"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import ToastMessage from "../../components/ToastMessage";
import CreateRoomForm from "../../components/CreateRoomForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import {
  BsArrowLeft,
  BsPlusCircle,
  BsPencil,
  BsTrash,
  BsDoorOpen,
  BsPeople,
  BsBuilding,
} from "react-icons/bs";

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

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "dark");

    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/rooms");
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
      const response = await fetch(
        `http://localhost:3000/api/building/${room.building._id}/room/${room._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

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
    <Container
      fluid
      className="py-4 px-4"
      style={{ backgroundColor: "#212529", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link
            to="/admin"
            className="btn btn-outline-light d-inline-flex align-items-center mb-3"
          >
            <BsArrowLeft className="me-2" /> Back to Admin
          </Link>
          <h1 className="text-light mb-0">Room Management</h1>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="d-flex align-items-center"
          onClick={() => {
            setSelectedRoom(null);
            setIsEditing(false);
            setIsFormOpen(true);
          }}
        >
          <BsPlusCircle className="me-2" /> Create Room
        </Button>
      </div>

      {isFormOpen && (
        <CreateRoomForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setIsEditing(false);
            setSelectedRoom(null);
          }}
          onRoomAdded={(newRoom) => {
            setRooms([...rooms, newRoom]);
            showToast(`Room created successfully`, "success");
          }}
          onEditRoom={(updatedRoom) => {
            setRooms(
              rooms.map((b) => (b._id === updatedRoom._id ? updatedRoom : b))
            );
            showToast(`Room updated successfully`, "success");
          }}
          onError={(errorMessage) => showToast(errorMessage, "danger")}
          room={selectedRoom}
        />
      )}

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-light mt-3">Loading rooms...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && rooms.length === 0 && (
        <Alert variant="info">
          <div className="d-flex align-items-center">
            <BsDoorOpen className="me-3" size={24} />
            <div>
              <Alert.Heading>No Rooms Available</Alert.Heading>
              <p className="mb-0">
                No rooms available. Create your first room to get started.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {!loading && rooms.length > 0 && (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {rooms.map((room) => (
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
                      {room.building.name}
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

                  {/* <div className="mb-3">
                                        <Badge bg="info" className="d-flex align-items-center">
                                            <BsBuilding className="me-1" /> {room.building?.name || "Unknown Building"}
                                        </Badge>
                                    </div> */}

                  <Card.Text className="text-light opacity-75 mb-4">
                    This room can accommodate up to {room.capacity}{" "}
                    {room.capacity === 1 ? "person" : "people"}.
                  </Card.Text>

                  <div className="mt-auto d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      className="flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={() => handleEditRoom(room)}
                    >
                      <BsPencil className="me-1" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="flex-grow-1 d-flex align-items-center justify-content-center"
                      onClick={() => handleDeleteRoom(room)}
                    >
                      <BsTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {toast && (
        <ToastMessage
          text={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Container>
  );
};

export default Rooms;
