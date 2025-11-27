// Em: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// Importamos Link para a rota de Cadastro
import { useNavigate, useLocation, Link } from 'react-router-dom'; 
import { Form, Button, InputGroup, Card, Container } from 'react-bootstrap';
// Importamos ícones para a funcionalidade de "Mostrar Senha"
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import './LoginPage.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Estado para a funcionalidade "Mostrar Senha"
  const [showPassword, setShowPassword] = useState(false); 
  
  const auth = useAuth(); 
  const navigate = useNavigate(); 
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Falha no login');
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ maxWidth: '400px', width: '100%' }} className="p-4 shadow-sm">
        <h2 className="text-center mb-4">Login</h2>
        
        {error && <p className="login-error text-center text-danger">{error}</p>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Usuário:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Senha:</Form.Label>
            {/* Campo de senha com o botão de "Mostrar Senha" */}
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>
        
          <div className="d-grid mb-3"> 
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </Form>
        
        {/* --- LINK DE CADASTRO --- */}
        <div className="text-center pt-3 border-top">
          <p className="mb-2 small">Ainda não tem uma conta?</p>
          <Link to="/register" className="btn btn-success w-100">
            Criar conta agora
          </Link>
        </div>
        {/* ----------------------------------------------- */}

        <div className="login-info mt-3 border-top pt-3 text-center">
          <p className="mb-1">Usuário Teste (Lembre-se de criá-los via Cadastro):</p>
          <p className="mb-0 small">Ex: <code>user_free</code> / Senha: <code>123</code></p>
        </div>

      </Card>
    </Container>
  );
}

export default LoginPage;