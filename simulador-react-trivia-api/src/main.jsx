// Em: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// --- 1. IMPORTE TODOS OS COMPONENTES NOVOS ---
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx'; // Contexto do Modo Escuro
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // Rota de Cadastro
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './pages/LoginPage.css'; 

// Seus componentes de página existentes
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import SimuladoDetalhesPage from './pages/SimuladoDetalhesPage.jsx';
import SimuladoPage from './pages/SimuladoPage.jsx';
import ResultadoPage from './pages/ResultadoPage.jsx';
import ConfigPage from './pages/ConfigPage.jsx';
import SimuladoApiPage from './pages/SimuladoApiPage.jsx';
import ApiDemoPage from './pages/ApiDemoPage.jsx';
import UsuarioPage from './pages/UsuarioPage.jsx'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O AuthProvider é o cérebro do Login */}
    <AuthProvider>
      {/* O ThemeProvider gerencia o Modo Escuro */}
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>

              {/* --- Rotas de Autenticação --- */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} /> {/* <--- ROTA DE CADASTRO */}
              
              {/* --- Rotas Públicas --- */}
              <Route index element={<HomePage />} />
              <Route path="configuracoes" element={<ConfigPage />} />
              <Route path="api-demo" element={<ApiDemoPage />} />

              {/* --- Rotas Protegidas (Requrem Login) --- */}
              <Route 
                path="simulado/detalhes/:id" 
                element={
                  <ProtectedRoute>
                    <SimuladoDetalhesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="simulado/:id" 
                element={
                  <ProtectedRoute>
                    <SimuladoPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="resultado" 
                element={
                  <ProtectedRoute>
                    <ResultadoPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="simulado-api/:id" 
                element={
                  <ProtectedRoute>
                    <SimuladoApiPage />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="usuario"
                element={
                  <ProtectedRoute>
                    <UsuarioPage />
                  </ProtectedRoute>
                }
              />

            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);