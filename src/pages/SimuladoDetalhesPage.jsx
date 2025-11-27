// src/pages/SimuladoDetalhesPage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { dadosSimulado } from '../data/dadosSimulado.js';
import SelecaoSimulado from '../components/SelecaoSimulado.jsx';

function SimuladoDetalhesPage() {
  const { id } = useParams(); // Pega 'unicamp', 'fuvest', etc. da URL
  const navigate = useNavigate();
  const questoesVestibular = dadosSimulado[id] || [];

  // Pega a lista de matérias únicas para este vestibular
  const materiasDisponiveis = [...new Set(questoesVestibular.map(q => q.materia))];

  const handleIniciarSimulado = (opcoes) => {
    // Navega para a página do simulado, passando as opções selecionadas
    navigate(`/simulado/${id}`, {
      state: {
        opcoes, // { dificuldade: 'medio', materias: ['História'] }
      },
    });
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center text-uppercase">{id}</h1>
      <p className="lead text-center">Selecione as opções para começar</p>
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '500px', width: '100%' }}>
            <SelecaoSimulado
                materiasDisponiveis={materiasDisponiveis}
                questoesDisponiveis={questoesVestibular}
                onIniciar={handleIniciarSimulado}
            />

        </div>
      </div>
    </Container>
  );
}

export default SimuladoDetalhesPage;    