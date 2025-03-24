import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { getBuildings, getBuildingRooms, createBuilding } from '../../services/api';

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
    try {
      const data = await getBuildingRooms(building._id);
      setRooms(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateBuilding = async () => {
    const name = prompt('Enter building name:');
    if (!name) return;

    try {
      const newBuilding = await createBuilding(name);
      setBuildings([...buildings, newBuilding]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="py-4">
      <h1>Building Management</h1>
      <Button onClick={handleCreateBuilding} className="mb-3">Create Building</Button>

      {loading ? (
        <Spinner animation="border" />
      ) : buildings.length === 0 ? (
        <Alert variant="info">No buildings available</Alert>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Building Name</th>
              <th>Rooms</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building._id}>
                <td>{building.name}</td>
                <td>
                  <Button variant="link" onClick={() => fetchRooms(building)}>
                    View Rooms
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal to show rooms */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rooms in {selectedBuilding?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {rooms.length > 0 ? (
            <ul>
              {rooms.map((room) => (
                <li key={room._id}>{room.number} (Capacity: {room.capacity})</li>
              ))}
            </ul>
          ) : (
            <Alert variant="info">No rooms found.</Alert>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Buildings;
