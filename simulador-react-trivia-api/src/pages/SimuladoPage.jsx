// Em: src/pages/SimuladoPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Container, Button, Row, Col, ProgressBar, Alert, Spinner } from 'react-bootstrap';

import { dadosSimulado } from '../data/dadosSimulado.js';
import QuestaoCard from '../components/QuestaoCard.jsx';
import { apiPost } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext.jsx'; // --- NOVO ---

// Embaralhar (Fisher–Yates)
const embaralharArray = (arr) => {
  // ... (código de embaralhar continua igual)
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


export default function SimuladoPage() {
  const { id } = useParams(); // unicamp, fuvest, ...
  const location = useLocation();
  const auth = useAuth(); // --- NOVO --- Pega o contexto de autenticação

  const opcoes = location.state?.opcoes || { dificuldade: 'todas', materia: '', numQuestoes: 5 };
  const usarAPI = location.state?.usarAPI === true;

  const { dificuldade, materia, numQuestoes } = opcoes;

  const [respostas, setRespostas] = useState({});
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);

  const [apiQuestoes, setApiQuestoes] = useState([]);
  const [apiLoading, setApiLoading] = useState(usarAPI); 
  const [apiError, setApiError] = useState('');

  // --- MUDANÇA PRINCIPAL: useEffect ---
  useEffect(() => {
    if (!usarAPI) return; 

    const carregarQuestoesFastAPI = async () => {
      setApiLoading(true);
      setApiError('');
      try {
        // --- MODIFICADO ---
        // Agora passamos o token no 3º argumento (opções)
        const questoesDaApi = await apiPost(
          `/gerar-simulado/${id}`, // path
          opcoes,                 // body
          {                       // options
            headers: {
              // Aqui está a AUTENTICAÇÃO (5%)
              Authorization: `Bearer ${auth.token}`
            }
          }
        );
        // --- FIM DA MODIFICAÇÃO ---

        // Se a chamada acima falhar (ex: 403 Proibido),
        // o 'apiPost' vai dar 'throw' e o 'catch' abaixo
        // vai pegar o erro (ex: "Usuários 'free' só podem..."),
        // cumprindo a AUTORIZAÇÃO (10%).

        const questoesFormatadas = (questoesDaApi || []).map(q => ({
          ...q,
          opcoes: q.opcoes.map(opt => opt.texto)
        }));
        
        setApiQuestoes(questoesFormatadas);
        setIndiceQuestaoAtual(0);
        setRespostas({});

      } catch (e) {
        setApiError(e.message || 'Erro ao buscar questões no FastAPI');
      } finally {
        setApiLoading(false);
      }
    };

    carregarQuestoesFastAPI();
    
    // --- MODIFICADO ---
    // Adicionamos 'auth.token' na dependência.
  }, [usarAPI, id, location.state, auth.token]); 
  // --- FIM DA MUDANÇA ---


  // Origem das questões: API ou local (fallback)
  let questoesDoSimulado = [];
  if (usarAPI) {
    questoesDoSimulado = apiQuestoes;
  } else {
    // Fallback para dados locais (se o usuário recarregar a página)
    console.warn("Usando fallback de dados locais (dadosSimulado.js)");
    const base = dadosSimulado[id] || [];
    const filtradas = base.filter((q) => {
      const okDif = dificuldade === 'todas' || q.dificuldade === dificuldade;
      const okMat = materia === '' || q.materia === materia; 
      return okDif && okMat;
    });
    questoesDoSimulado = embaralharArray(filtradas).slice(0, numQuestoes);
  }

  const perguntaAtual = questoesDoSimulado[indiceQuestaoAtual];

  // Handlers (sem mudanças)
  const handleRespostaSelecionada = (indiceEscolhido) => {
    if (!perguntaAtual) return;
    setRespostas((prev) => ({ ...prev, [perguntaAtual.id]: indiceEscolhido }));
  };
  const handleProximaQuestao = () => {
    setIndiceQuestaoAtual((prev) => Math.min(prev + 1, questoesDoSimulado.length - 1));
  };
  const handleQuestaoAnterior = () => {
    setIndiceQuestaoAtual((prev) => Math.max(prev - 1, 0));
  };
  const progresso = questoesDoSimulado.length
    ? Math.round(((indiceQuestaoAtual + 1) / questoesDoSimulado.length) * 100)
    : 0;

  // Estados de carregamento/erro da API (sem mudanças)
  if (usarAPI && apiLoading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <div className="mt-2">Gerando simulado com IA...</div>
      </Container>
    );
  }
  if (usarAPI && apiError) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Erro ao gerar simulado: {apiError}</Alert>
s
        <Link to={`/`} className="btn btn-secondary"> {/* --- NOVO (sugestão) --- Manda para Home */}
          Voltar
        </Link>
      </Container>
    );
  }
  if (!questoesDoSimulado.length && !apiLoading) { 
    return (
      <Container className="py-4">
        <Alert variant="warning">Nenhuma questão encontrada para os filtros selecionados.</Alert>
        <Link to={`/`} className="btn btn-secondary"> {/* --- NOVO (sugestão) --- Manda para Home */}
          Voltar
        </Link>
      </Container>
    );
  }

  // --- Renderização (só renderiza se tiver pergunta) ---
  if (!perguntaAtual) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <div className="mt-2">Carregando...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4>Simulado — {(id || '').toUpperCase()}</h4>
          {/* --- NOVO (Opcional) --- Mostra o usuário logado */}
          <p className="text-muted small">
            Usuário: {auth.user?.username} ({auth.user?.role})
          </p>
        </Col>
        <Col className="text-end">
          <span>{indiceQuestaoAtual + 1} / {questoesDoSimulado.length}</span>
          <ProgressBar now={progresso} className="mt-1" />
        </Col>
      </Row>

      <QuestaoCard
        pergunta={perguntaAtual}
        respostaUsuario={respostas[perguntaAtual.id]}
        onRespostaSelecionada={handleRespostaSelecionada}
      />

      <Row className="mt-3">
        <Col>
          <Button variant="secondary" onClick={handleQuestaoAnterior} disabled={indiceQuestaoAtual === 0}>
            Anterior
          </Button>
        </Col>
        <Col className="text-end">
          {indiceQuestaoAtual < questoesDoSimulado.length - 1 ? (
            <Button onClick={handleProximaQuestao}>Próxima</Button>
          ) : (
            <Button
              variant="success"
              as={Link}
              to="/resultado"
              state={{ respostas, questoes: questoesDoSimulado }}
            >
              Finalizar Simulado
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}