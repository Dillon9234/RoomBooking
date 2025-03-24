// frontend/src/pages/AdminBuildings.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreateBuildingForm from "../../components/CreateBuildingForm";
import ToastMessage from "../../components/ToastMessage";
import { getBuildings, deleteBuilding } from "../../services/api";

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBuildings();
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
    <Container className="py-4">
      <h1 className="mb-4">Building Management</h1>
      
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <Link to="/admin" className="btn btn-outline-secondary">
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
          <Spinner animation="border" variant="primary" role="status">
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

      {buildings.length > 0 && !loading && (
        <Table responsive hover bordered>
          <thead className="table-dark">
            <tr>
              <th>Building Name</th>
              <th>Number of Rooms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building._id}>
                <td>{building.name}</td>
                <td>{building.rooms?.length || 0}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2" 
                    onClick={() => handleEditBuilding(building)}
                  >
                    Edit
                  </Button>
                  {/* <Link 
                    to={`/admin/buildings/${building._id}/rooms`}
                    className="btn btn-outline-secondary btn-sm me-2"
                  >
                    Manage Rooms
                  </Link> */}
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteBuilding(building)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Buildings;