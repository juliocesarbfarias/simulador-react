import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const simuladosDisponiveis = [
  {
    id: 'unicamp',
    nome: 'UNICAMP',
    descricao: 'Teste seus conhecimentos com as provas da Universidade Estadual de Campinas.',
    imagem: 'https://www.unicamp.br/unicamp/sites/default/files/2021-11/logo_unicamp_novo_cor.png' // URL de exemplo
  },
  {
    id: 'fuvest',
    nome: 'FUVEST',
    descricao: 'Prepare-se para o vestibular da USP com simulados baseados na FUVEST.',
    imagem: 'https://logopng.com.br/logos/fuvest-43.svg' // URL de exemplo
  },
  {
    id: 'utfpr',
    nome: 'UTFPR',
    descricao: 'Simulados focados no vestibular da Universidade Tecnológica Federal do Paraná.',
    imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_UTFPR.svg/1200px-Logo_UTFPR.svg.png' // URL de exemplo
  },
  {
    id: 'uem',
    nome: 'UEM',
    descricao: 'Avalie seu desempenho para as provas da Universidade Estadual de Maringá.',
    imagem: 'https://www.uem.br/simbolos/brasao-uem-cor.png' // URL de exemplo
  },
  {
    id: 'unesp',
    nome: 'UNESP',
    descricao: 'Encare os desafios do vestibular da Universidade Estadual Paulista.',
    imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/UNESP_logo.svg/1200px-UNESP_logo.svg.png' // URL de exemplo
  }
];

function HomePage() {
  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h1>Simulados Online</h1>
        <p className="lead">
          Escolha um dos vestibulares abaixo e comece a praticar agora mesmo.
        </p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {}
        {simuladosDisponiveis.map((simulado) => (
          <Col key={simulado.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={simulado.imagem}
                style={{ height: '150px', objectFit: 'contain', padding: '10px' }}
                alt={`Logo ${simulado.nome}`}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{simulado.nome}</Card.Title>
                <Card.Text>
                  {simulado.descricao}
                </Card.Text>
                {/*simulado */}
                {/* card */}
                <Button
                  as={Link}
                  to={`/simulado/${simulado.id}`}
                  variant="primary"
                  className="mt-auto"
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
