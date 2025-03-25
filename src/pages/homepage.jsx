// frontend/src/pages/Home.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} className="text-center">
          <h1 className="display-4 mb-4">Room Allotment Application</h1>
          <p className="lead mb-5">
            Allot rooms in various buildings for your meetings, events, and more.
          </p>
          
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/buildings">
              <Button variant="primary" size="lg">View Buildings</Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline-secondary" size="lg">Admin Login</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;