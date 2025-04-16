import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return null;
};

const Home = () => {
  const navigate = useNavigate();
  const token = getCookie("token");

  let isAdmin = false;
  if (token) {
    try {
      jwtDecode(token);
      isAdmin = true;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleAdminClick = () => {
    navigate("/admin");
  };

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
              <Button variant="primary" size="lg">
                View Buildings
              </Button>
            </Link>
            {isAdmin ? (
              <Button variant="outline-secondary" size="lg" onClick={handleAdminClick}>
                Admin
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline-secondary" size="lg">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
