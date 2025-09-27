import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { PersonCircle, GearFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/*marca */}
        <Navbar.Brand as={Link} to="/">Meu App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to="/usuario" className="d-flex align-items-center">
              <PersonCircle className="me-2" />
              <span>Usuário</span>
            </Nav.Link>
            {/*configurações */}
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