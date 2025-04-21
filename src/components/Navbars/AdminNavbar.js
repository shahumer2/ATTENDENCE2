import React from "react";
import { Navbar, Nav, Container, Image } from "react-bootstrap";
import reactlogo from "../../assets/img/reactlogo.png";

function Header() {
  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#0e2288",
        padding: "1rem",
      }}
      variant="dark"
    >
      <Container fluid>
        <div className="d-flex flex-column align-items-start">
          {/* Top Row: Logo + Title */}
          <div className="d-flex align-items-center mb-2">
            <Navbar.Brand href="#" onClick={(e) => e.preventDefault()}>
              <Image
                src={reactlogo}
                alt="Logo"
                style={{ width: "70px", height: "auto" }}
              />
            </Navbar.Brand>

            <div style={{ marginLeft: "10px" }}>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#FFD700",
                }}
              >
                PAYROLL
              </span>
            </div>
          </div>

          {/* Bottom Row: Nav Links */}
          <Nav className="d-flex align-items-center">
          <Nav.Item>
              <Nav.Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-white"
                style={{ fontSize: "1.2rem", fontWeight: "500" }}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-white"
                style={{ fontSize: "1.2rem", fontWeight: "500" }}
              >
                Department
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-white"
                style={{ fontSize: "1.2rem", fontWeight: "500" }}
              >
                User
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-white"
                style={{ fontSize: "1.2rem", fontWeight: "500" }}
              >
                Company
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
