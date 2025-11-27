// Em: src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { apiRegister } from '../services/apiClient'; 

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'free' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiRegister(formData);
      alert('Conta criada com sucesso! Faça login agora.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ maxWidth: '400px', width: '100%' }} className="p-4 shadow-sm">
        <h2 className="text-center mb-4">Criar Conta</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Nome de Usuário</Form.Label>
            <Form.Control 
              type="text" 
              required 
              placeholder="Ex: joao_silva"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control 
              type="email" 
              required 
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Senha</Form.Label>
            <Form.Control 
              type="password" 
              required 
              placeholder="Sua senha secreta"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="role">
            <Form.Label>Tipo de Conta</Form.Label>
            <Form.Select value={formData.role} onChange={handleChange}>
              <option value="free">Free (Max 5 questões)</option>
              <option value="premium">Premium (Max 50 questões)</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Cadastrar'}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <small>
            Já tem uma conta? <Link to="/login">Entrar aqui</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}

// ESTA É A LINHA QUE ESTAVA FALTANDO!
export default RegisterPage;