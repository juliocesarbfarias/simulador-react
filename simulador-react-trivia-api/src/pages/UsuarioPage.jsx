// Em: src/pages/UsuarioPage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { PersonBadge, ClockHistory, ShieldCheck, ArrowUpCircle } from 'react-bootstrap-icons';

// Função para formatar a data
function formatarData(isoString) {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  } catch (e) {
    return 'Data inválida';
  }
}

function UsuarioPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  // Pega a data de login que salvamos no localStorage
  const ultimaSessao = localStorage.getItem('lastLogin');

  const handleLogout = () => {
    auth.logout();
    navigate('/'); // Envia o usuário para a Home após o logout
  };

  // Se (por algum motivo) o usuário chegar aqui sem estar logado
  if (!auth.user) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Você não está logado. Por favor, <Alert.Link href="/login">faça o login</Alert.Link>.
        </Alert>
      </Container>
    );
  }

  const { username, role } = auth.user;

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Header as="h3" className="d-flex align-items-center">
          <PersonBadge size={30} className="me-3" />
          Perfil do Usuário
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Usuário:</strong> {username}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Tipo de Conta:</strong> 
              <span className={role === 'premium' ? 'text-success' : 'text-primary'}>
                {role === 'premium' ? ' Premium' : ' Free'}
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Última Sessão:</strong> {formatarData(ultimaSessao)}
            </ListGroup.Item>
          </ListGroup>

          <hr />

          {/* --- Minhas Sugestões de Ideias --- */}

          {/* 1. Um "call to action" se o usuário for 'free' */}
          {role === 'free' && (
            <Alert variant="info" className="text-center">
              <Alert.Heading><ArrowUpCircle size={24} className="me-2" />Faça um Upgrade!</Alert.Heading>
              <p>
                Gostando dos simulados? Usuários Premium podem gerar até 50 questões por vez.
              </p>
              <Button variant="success">Quero ser Premium</Button>
            </Alert>
          )}

          {/* 2. Um botão de Logout é essencial nesta página */}
          <div className="d-grid">
            <Button variant="danger" onClick={handleLogout}>
              <ClockHistory className="me-2" />
              Sair (Logout)
            </Button>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default UsuarioPage;