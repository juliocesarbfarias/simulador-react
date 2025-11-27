import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import SimuladoDetalhesPage from './pages/SimuladoDetalhesPage.jsx';
import SimuladoPage from './pages/SimuladoPage.jsx';
import ResultadoPage from './pages/ResultadoPage.jsx';
import ConfigPage from './pages/ConfigPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {}
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="configuracoes" element={<ConfigPage />} />
          <Route path="simulado/detalhes/:id" element={<SimuladoDetalhesPage />} />
          <Route path="simulado/:id" element={<SimuladoPage />} />
          <Route path="resultado" element={<ResultadoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);