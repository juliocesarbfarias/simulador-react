import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { PersonCircle, GearFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // --- 1. IMPORTE O HOOK ---

function Header() {
  // --- 2. USE O HOOK PARA SABER SE ESTÁ LOGADO ---
  const { isAuthenticated } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Meu App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

          
            {isAuthenticated ? (
              <Nav.Link as={Link} to="/usuario" className="d-flex align-items-center">
                  <PersonCircle className="me-2" />
                  <span>Usuário</span>
                </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                  <PersonCircle className="me-2" />
                  <span>Login</span>
                </Nav.Link>
            )}
            
           
            
            <Nav.Link as={Link} to="/api-demo">
              API Demo
            </Nav.Link>
            <Nav.Link as={Link} to="/configuracoes">
              <GearFill />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;