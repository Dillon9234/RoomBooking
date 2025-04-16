// frontend/src/pages/Admin.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Dash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};
import { useEffect } from 'react';
import { useState } from 'react';

const Dashboard = () => {

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