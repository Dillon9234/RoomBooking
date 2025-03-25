import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Spinner, Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreateBuildingForm from "../../components/CreateBuildingForm";
import ToastMessage from "../../components/ToastMessage";
import { getBuildings, deleteBuilding } from "../../services/api";
import { BsBuilding } from 'react-icons/bs'; // Import building icon


const cardStyle = {
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: '#2a2a2a',
  border: 'none',
  borderRadius: '8px',
  overflow: 'hidden'
};

const cardHoverStyle = {
  transform: 'scale(1.05)',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer'
};

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [toast, setToast] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);


  useEffect(() => {
    fetchBuildings();
    
    // Force dark theme
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await getBuildings();
      setBuildings(data);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ text: message, type });
  };

  const handleEditBuilding = (building) => {
    setSelectedBuilding(building);
    setIsFormOpen(true);
  };

  const handleDeleteBuilding = async (building) => {
    if (!window.confirm(`Are you sure you want to delete "${building.name}"?`)) {
      return;
    }

    try {
      await deleteBuilding(building._id);
      setBuildings(buildings.filter((b) => b._id !== building._id));
      showToast(`Building "${building.name}" deleted successfully`, "success");
    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to delete building", "danger");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedBuilding(null);
  };

  return (
    <Container className="py-4 text-light">
      <h1 className="mb-4">Building Management</h1>
      
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <Link to="/admin" className="btn btn-outline-light">
            &larr; Back to Admin
          </Link>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedBuilding(null);
              setIsFormOpen(true);
            }}
          >
            Create Building
          </Button>
        </Col>
      </Row>

      {toast && (
        <ToastMessage
          message={toast.text}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <CreateBuildingForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onBuildingAdded={(newBuilding) => {
          setBuildings((prev) => [...prev, newBuilding]);
          showToast(`Building "${newBuilding.name}" created successfully`, "success");
        }}
        onEditBuilding={(updatedBuilding) => {
          setBuildings((prevBuildings) =>
            prevBuildings.map((b) => (b._id === updatedBuilding._id ? updatedBuilding : b))
          );
          showToast(`Building "${updatedBuilding.name}" updated successfully`, "success");
        }}
        onError={(errorMessage) => {
          showToast(errorMessage, "danger");
        }}
        building={selectedBuilding}
      />

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="light" role="status">
            <span className="visually-hidden">Loading buildings...</span>
          </Spinner>
        </div>
      )}

      {error && !loading && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!loading && !error && buildings.length === 0 && (
        <Alert variant="info">
          No buildings available. Create a new building to get started.
        </Alert>
      )}

{buildings.length === 0 ? (
        <Alert variant="info">No buildings available at the moment.</Alert>
      ) : (
        <Row xs={1} md={3} lg={4} className="g-4">
          {buildings.map((building) => (
            <Col key={building._id}>
              <Link 
                to={`/admin/building/${building._id}/rooms`} 
                className="text-decoration-none"
              >
                <Card 
                  className="h-100" 
                  style={{
                    ...cardStyle,
                    ...(hoveredCard === building._id ? cardHoverStyle : {})
                  }}
                  onMouseEnter={() => setHoveredCard(building._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4 text-white">
                    <div className="mb-3 text-primary" style={{ fontSize: '2.5rem' }}>
                      <BsBuilding />
                    </div>
                    <Card.Title className="text-center mb-3 fw-bold">{building.name}</Card.Title>
                    <div className="bg-primary text-white px-3 py-2 rounded-pill">
                      {building.rooms?.length || 0} Room{building.rooms?.length !== 1 ? 's' : ''}
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Buildings;
