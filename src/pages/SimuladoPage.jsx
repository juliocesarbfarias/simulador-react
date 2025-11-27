// src/pages/SimuladoPage.jsx (versão final atualizada)

import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Container, Button, Row, Col, ProgressBar, Alert } from 'react-bootstrap';

import { dadosSimulado } from '../data/dadosSimulado.js';
import QuestaoCard from '../components/QuestaoCard.jsx';

// Função para embaralhar um array (algoritmo Fisher-Yates)
const embaralharArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function SimuladoPage() {
  const { id } = useParams();
  const location = useLocation();

  if (!location.state?.opcoes) {
    return (
        <Container className="text-center mt-5">
            <Alert variant="warning">Opções não selecionadas.</Alert>
            <p>Por favor, selecione a dificuldade e as matérias antes de começar.</p>
            <Button as={Link} to={`/simulado/detalhes/${id}`}>Voltar para Seleção</Button>
        </Container>
    );
  }

  const { dificuldade, materias, numQuestoes } = location.state.opcoes;

  // Lógica de filtragem
  const questoesFiltradas = (dadosSimulado[id] || []).filter(questao => {
    const correspondeDificuldade = dificuldade === 'todas' || questao.dificuldade === dificuldade;
    const correspondeMateria = materias.includes(questao.materia);
    return correspondeDificuldade && correspondeMateria;
  });

  // Embaralha e depois pega a quantidade de questões solicitada
  const questoesDoSimulado = embaralharArray(questoesFiltradas).slice(0, numQuestoes);

  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState({});

  const handleRespostaSelecionada = (indiceOpcao) => {
    const questaoAtual = questoesDoSimulado[indiceQuestaoAtual];
    setRespostas({ ...respostas, [questaoAtual.id]: indiceOpcao });
  };

  const handleProximaQuestao = () => {
    if (indiceQuestaoAtual < questoesDoSimulado.length - 1) {
      setIndiceQuestaoAtual(indiceQuestaoAtual + 1);
    }
  };

  const handleQuestaoAnterior = () => {
    if (indiceQuestaoAtual > 0) {
      setIndiceQuestaoAtual(indiceQuestaoAtual - 1);
    }
  };

  if (questoesDoSimulado.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Nenhuma Questão Encontrada</h2>
        <p>Não encontramos questões com os filtros selecionados.</p>
        <Button as={Link} to={`/simulado/detalhes/${id}`}>Voltar e Tentar Novamente</Button>
      </Container>
    );
  }

  const progresso = ((indiceQuestaoAtual + 1) / questoesDoSimulado.length) * 100;
  const questaoAtual = questoesDoSimulado[indiceQuestaoAtual];

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-3">Simulado em Andamento</h2>
      <ProgressBar now={progresso} label={`${Math.round(progresso)}%`} className="mb-4" />
      
      <QuestaoCard
        pergunta={questaoAtual}
        onRespostaSelecionada={handleRespostaSelecionada}
        respostaUsuario={respostas[questaoAtual.id]}
      />

      <Row className="mt-4">
        <Col>
          <Button onClick={handleQuestaoAnterior} disabled={indiceQuestaoAtual === 0}>
            Anterior
          </Button>
        </Col>
        <Col className="text-end">
          {indiceQuestaoAtual < questoesDoSimulado.length - 1 ? (
            <Button onClick={handleProximaQuestao}> Próxima </Button>
          ) : (
            <Button variant="success" as={Link} to="/resultado" state={{ respostas, questoes: questoesDoSimulado }}>
              Finalizar Simulado
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SimuladoPage;