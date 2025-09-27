import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Row, Col, ProgressBar } from 'react-bootstrap';

import { dadosSimulado } from '../data/dadosSimulado'; 
import QuestaoCard from '../components/QuestaoCard'; 

function SimuladoPage() {
  const { id } = useParams(); 
  const questoes = dadosSimulado[id] || [];

  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState({});

  const handleRespostaSelecionada = (indiceOpcao) => {
    const questaoAtual = questoes[indiceQuestaoAtual];
    setRespostas({
      ...respostas,
      [questaoAtual.id]: indiceOpcao,
    });
  };

  const handleProximaQuestao = () => {
    if (indiceQuestaoAtual < questoes.length - 1) {
      setIndiceQuestaoAtual(indiceQuestaoAtual + 1);
    }
  };

  const handleQuestaoAnterior = () => {
    if (indiceQuestaoAtual > 0) {
      setIndiceQuestaoAtual(indiceQuestaoAtual - 1);
    }
  };

  if (questoes.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Simulado não encontrado</h2>
        <p>Não encontramos questões para o vestibular "{id}".</p>
        <Button as={Link} to="/">Voltar para o Início</Button>
      </Container>
    );
  }
  
 {indiceQuestaoAtual < questoes.length - 1 ? (
            <Button onClick={handleProximaQuestao}>
              Próxima
            </Button>
          ) : (
            // 👇 ALTERAÇÃO AQUI 👇
            <Button variant="success" as={Link} to="/resultado" state={{ respostas, questoes }}>
              Finalizar Simulado
            </Button>
          )}

  const progresso = ((indiceQuestaoAtual + 1) / questoes.length) * 100;
  const questaoAtual = questoes[indiceQuestaoAtual];

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
          <Button
            onClick={handleQuestaoAnterior}
            disabled={indiceQuestaoAtual === 0}
          >
            Anterior
          </Button>
        </Col>
        <Col className="text-end">
          {indiceQuestaoAtual < questoes.length - 1 ? (
            <Button onClick={handleProximaQuestao}>
              Próxima
            </Button>
          ) : (
            <Button variant="success" as={Link} to="/resultado">
              Finalizar Simulado
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SimuladoPage;