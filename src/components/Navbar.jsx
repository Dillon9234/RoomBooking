import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Helper function to read a cookie by name
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
};

const NavigationBar = () => {
  const navigate = useNavigate();

  const token = getCookie("token"); // Fetch token from cookie
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = true;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleRedirect = (pathForUser, pathForAdmin) => {
    if (token && isAdmin) {
      navigate(pathForAdmin);
    } else {
      navigate(pathForUser);
    }
  };

  const handleLogout = () => {
    // Delete the token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/");
    window.location.reload(); // Reload to re-render the navbar state
  };

  return (
    <Navbar expand="md" bg="dark" variant="dark" className="border-bottom">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Room Allotment</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="text-white">
              Dashboard
            </Nav.Link>

            <Nav.Link onClick={() => handleRedirect("/buildings", "/admin/buildings")} className="text-white" style={{ cursor: "pointer" }}>
              Buildings
            </Nav.Link>

            {token && (
              <Nav.Link onClick={() => handleRedirect("/room", "/admin/rooms")} className="text-white" style={{ cursor: "pointer" }}>
                Rooms
              </Nav.Link>
            )}

            {isAdmin && (
              <Nav.Link as={NavLink} to="/admin/bookings" className="text-white">
                Allotment
              </Nav.Link>
            )}

            {!token ? (
              <Nav.Link as={NavLink} to="/login" className="text-white">
                Login
              </Nav.Link>
            ) : (
              <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-3">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
