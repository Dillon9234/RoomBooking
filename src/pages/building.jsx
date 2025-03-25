import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBuildings } from '../services/api';
import { BsBuilding } from 'react-icons/bs'; // Import building icon

// Add custom CSS for card hover effects
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

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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
      <Link to="/" className="btn btn-outline-light mb-4">
        &larr; Back to Home
      </Link>
      <h1 className="mb-4 mt-4">Available Buildings</h1>
      
      {buildings.length === 0 ? (
        <Alert variant="info">No buildings available at the moment.</Alert>
      ) : (
        <Row xs={1} md={3} lg={4} className="g-4">
          {buildings.map((building) => (
            <Col key={building._id}>
              <Link 
                to={`/building/${building._id}/rooms`} 
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

export default Building;
