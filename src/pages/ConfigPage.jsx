import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function ConfigPage() {
  return (
    <Container className="mt-4">
      <h1>Configurações</h1>
      <p>Ajuste as preferências do simulador.</p>
      <hr />

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nome de Usuário</Form.Label>
          <Form.Control type="text" placeholder="Seu nome" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTema">
          <Form.Label>Tema</Form.Label>
          <Form.Select>
            <option>Claro</option>
            <option>Escuro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="switch" label="Habilitar notificações por e-mail" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Salvar Alterações
        </Button>
      </Form>
    </Container>
  );
}
export default ConfigPage; 