// frontend/src/pages/Buildings.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBuildings } from '../services/api';

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getBuildings();
        setBuildings(data);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        setError(error.message || "Failed to load buildings");
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Available Buildings</h1>
      
      {buildings.length === 0 ? (
        <Alert variant="info">No buildings available at the moment.</Alert>
      ) : (
        <Row xs={2} md={3} lg={4} className="g-4">
          {buildings.map((building) => (
            <Col key={building._id}>
              <Link 
                to={`/buildings/${building._id}/rooms`} 
                className="text-decoration-none"
              >
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
                    <Card.Title className="text-center mb-3">{building.name}</Card.Title>
                    <Card.Text className="text-center text-muted mb-0">
                      {building.rooms?.length || 0} Room{building.rooms?.length !== 1 ? 's' : ''}
                    </Card.Text>
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

export default Building;