import React from "react";
import { Container } from "react-bootstrap";
import Navbar from "./Navbar"; // Adjust path if needed

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container fluid className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">{children}</main>
      </Container>
    </>
  );
};

export default Layout;
