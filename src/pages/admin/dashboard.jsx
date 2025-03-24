// frontend/src/pages/Admin.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Dash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Buildings</Card.Title>
              <Card.Text>Manage buildings and their information.</Card.Text>
              <Link to="/admin/buildings">
                <Button variant="primary">Manage Buildings</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Rooms</Card.Title>
              <Card.Text>Manage rooms across all buildings.</Card.Text>
              <Link to="/admin/rooms">
                <Button variant="primary">Manage Rooms</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Bookings</Card.Title>
              <Card.Text>View and manage room bookings.</Card.Text>
              <Link to="/admin/bookings">
                <Button variant="primary">Manage Bookings</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="d-flex justify-content-center">
        <Link to="/">
          <Button variant="outline-secondary">Return to Public Site</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Dashboard;