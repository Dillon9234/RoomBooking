import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LogoutForm from "./LogoutForm";

const NavigationBar = () => {
  return (
    <Navbar expand="md" bg="dark" variant="dark" className="border-bottom">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={NavLink} to="/">
          Room Booking
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="navbarNav" />

        {/* Navbar Content */}
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="text-white">
              Dashboard
            </Nav.Link>

            {/* Conditional Rendering for Authenticated User */}
            {true ? (
              <>
                <Nav.Link as={NavLink} to="/admin/buildings" className="text-white">
                  Buildings
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/rooms" className="text-white">
                  Rooms
                </Nav.Link>
                <Nav.Item>
                  <LogoutForm />
                </Nav.Item>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login" className="text-white">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
