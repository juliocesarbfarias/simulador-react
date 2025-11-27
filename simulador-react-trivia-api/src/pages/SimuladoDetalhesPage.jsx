// src/pages/SimuladoDetalhesPage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap'; // Importei o Card
import SelecaoSimulado from '../components/SelecaoSimulado.jsx';

function SimuladoDetalhesPage() {
  const { id } = useParams(); // Pega 'unicamp', 'fuvest', etc. da URL
  const navigate = useNavigate();
  
  const handleIniciarSimulado = (opcoes) => {
    navigate(`/simulado/${id}`, {
      state: {
        opcoes, 
        usarAPI: true 
      },
    });
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center"> {/* Centraliza o conteúdo */}
      <div className="text-center mb-4">
        {/* Título com cor primária e espaçamento moderno */}
        <h1 className="text-uppercase fw-bold display-5 text-primary">{id}</h1>
        <p className="lead text-muted">Selecione as opções para começar</p>
        <hr className="w-50 mx-auto" /> {/* Linha sutil para separar o título */}
      </div>

      <Card className="shadow-lg border-0 rounded-4 p-4 w-100" style={{ maxWidth: '550px' }}> {/* Card envolvente */}
        <Card.Body>
          <h4 className="card-subtitle mb-4 text-center text-secondary">
            Personalize seu Simulado
          </h4>
          
          {/* Mensagem de Aviso Melhorada */}
          <div className="alert alert-info text-center" role="alert" style={{ backgroundColor: 'var(--bs-primary-bg-subtle)' }}>
            Por favor, selecione a dificuldade e a matéria para começar.
          </div>

          {/* O formulário real está neste componente */}
          <SelecaoSimulado
            onIniciar={handleIniciarSimulado}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SimuladoDetalhesPage;