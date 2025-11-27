// Em: src/pages/HomePage.jsx

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookHalf } from 'react-bootstrap-icons'; // Importando ícone

// --- ETAPA 1: IMPORTE OS LOGOS ---
import logoUnicamp from '../assets/logo-unicamp.png';
import logoFuvest from '../assets/logo-fuvest.jpg';
import logoUtfpr from '../assets/UTFPR.jpg';
import logoUem from '../assets/logo-uem.png';
import logoUnesp from '../assets/unesp1.png';


// --- ETAPA 2: DADOS DO SIMULADO ---
const simuladosDisponiveis = [
  {
    id: 'unicamp',
    nome: 'UNICAMP',
    descricao: 'Teste seus conhecimentos com as provas da Universidade Estadual de Campinas.',
    imagem: logoUnicamp 
  },
  {
    id: 'fuvest',
    nome: 'FUVEST',
    descricao: 'Prepare-se para o vestibular da USP com simulados baseados na FUVEST.',
    imagem: logoFuvest
  },
  {
    id: 'utfpr',
    nome: 'UTFPR',
    descricao: 'Simulados focados no vestibular da Universidade Tecnológica Federal do Paraná.',
    imagem: logoUtfpr
  },
  {
    id: 'uem',
    nome: 'UEM',
    descricao: 'Avalie seu desempenho para as provas da Universidade Estadual de Maringá.',
    imagem: logoUem
  },
  {
    id: 'unesp',
    nome: 'UNESP',
    descricao: 'Encare os desafios do vestibular da Universidade Estadual Paulista.',
    imagem: logoUnesp
  }
];

function HomePage() {
  return (
    <Container className="mt-5">
      <div className="text-center mb-5 header-intro"> {/* Adicionei a classe header-intro */}
        
        {/* Título com ícone */}
        <h1 className="display-4 fw-bold mb-3 title-main">
          <BookHalf className="me-3" size={40} />
          Simulados Online
        </h1>
        
        <p className="lead text-muted">
          Escolha um dos vestibulares abaixo e comece a praticar agora mesmo.
        </p>
      </div>

      {/* Ajustei o espaçamento da coluna para ficar mais agradável */}
      <Row xs={1} md={2} lg={3} className="g-5"> 
        {simuladosDisponiveis.map((simulado) => (
          <Col key={simulado.id}>
            {/* Adicionei a classe card-home e aumentei a sombra */}
            <Card className="h-100 shadow-lg card-home border-0 rounded-4 overflow-hidden"> 
              <Card.Img
                variant="top"
                src={simulado.imagem} 
                style={{ height: '150px', objectFit: 'contain', padding: '15px', backgroundColor: 'var(--bs-light)' }} 
                alt={`Logo ${simulado.nome}`}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold fs-5 text-center text-uppercase title-card">{simulado.nome}</Card.Title>
                <Card.Text className="text-center mb-4">
                  {simulado.descricao}
                </Card.Text>
                <Button
                  as={Link}
                  to={`/simulado/detalhes/${simulado.id}`}
                  variant="primary"
                  className="mt-auto btn-lg rounded-pill" // Botão mais visível
                >
                  Iniciar Simulado
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomePage;