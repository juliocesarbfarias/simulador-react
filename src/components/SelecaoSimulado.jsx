import React, { useState, useMemo } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

function SelecaoSimulado({ materiasDisponiveis, questoesDisponiveis, onIniciar }) {
  const [dificuldade, setDificuldade] = useState('');
  const [materiasSelecionadas, setMateriasSelecionadas] = useState([]);
  const [numQuestoes, setNumQuestoes] = useState(5);

  const maxQuestoesDisponiveis = useMemo(() => {
    if (materiasSelecionadas.length === 0) return 0;

    return questoesDisponiveis.filter(q => {
      const correspondeDificuldade = dificuldade === 'todas' || q.dificuldade === dificuldade || dificuldade === '';
      const correspondeMateria = materiasSelecionadas.includes(q.materia);
      return correspondeDificuldade && correspondeMateria;
    }).length;
  }, [dificuldade, materiasSelecionadas, questoesDisponiveis]);


  const handleMateriaChange = (materia) => {
    setMateriasSelecionadas((prev) =>
      prev.includes(materia)
        ? prev.filter((m) => m !== materia)
        : [...prev, materia]
    );
  };

  const handleIniciarClick = () => {
    onIniciar({
      dificuldade: dificuldade || 'todas',
      materias: materiasSelecionadas,
      numQuestoes,
    });
  };

  const isButtonDisabled = dificuldade === '' || materiasSelecionadas.length === 0;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Personalize seu Simulado</Card.Title>
        
        {}
        {materiasSelecionadas.length === 0 && (
            <Alert variant="info">
                Por favor, selecione a dificuldade e pelo menos uma matéria para começar.
            </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nível de Dificuldade</Form.Label>
            <Form.Select value={dificuldade} onChange={(e) => setDificuldade(e.target.value)}>
              <option value="" disabled>-- Selecione uma dificuldade --</option>
              <option value="todas">Todas as Dificuldades</option>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Matérias</Form.Label>
            <div>
              {materiasDisponiveis.map((materia) => (
                <Form.Check
                  key={materia}
                  type="checkbox"
                  id={`check-${materia}`}
                  label={materia}
                  checked={materiasSelecionadas.includes(materia)}
                  onChange={() => handleMateriaChange(materia)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantidade de Questões (Máx: {maxQuestoesDisponiveis})</Form.Label>
            <Form.Select 
              value={numQuestoes} 
              onChange={(e) => setNumQuestoes(Number(e.target.value))}
              disabled={maxQuestoesDisponiveis === 0}
            >
              {[5, 10, 15, 20].filter(n => n <= maxQuestoesDisponiveis).map(n => (
                  <option key={n} value={n}>{n} Questões</option>
              ))}
              {maxQuestoesDisponiveis > 0 && 
                <option value={maxQuestoesDisponiveis}>Todas ({maxQuestoesDisponiveis})</option>
              }
            </Form.Select>
          </Form.Group>

        </Form>
        <Button
          variant="primary"
          onClick={handleIniciarClick}
          disabled={isButtonDisabled} 
        >
          Iniciar Simulado
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SelecaoSimulado;