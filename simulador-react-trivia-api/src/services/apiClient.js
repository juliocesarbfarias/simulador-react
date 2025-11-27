// Em: src/services/apiClient.js
// Cliente de API com fallback e suporte a URL absoluta (The Trivia API)

const FALLBACK = "https://the-trivia-api.com/v2";
const BASE_URL = (import.meta?.env?.VITE_API_BASE_URL) || FALLBACK;

function buildUrl(path) {
  // Se já vier URL completa, use direto
  if (/^https?:\/\//i.test(path)) return path;
  const base = (BASE_URL || "").replace(/\/$/, "");
  const p = (path || "").replace(/^\//, "");
  return `${base}/${p}`;
}

/**
 * Faz uma requisição GET e retorna JSON.
 * @param {string} path - caminho relativo (ex: "questions?...") ou URL absoluta
 * @param {{signal?: AbortSignal, headers?: Record<string,string>}} opts 
 * @returns {Promise<any>}
 */
export async function apiGet(path, { signal, headers } = {}) {
  const url = buildUrl(path);
  // Log útil na devtools
  console.log("-> GET:", url);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      ...(headers || {})
    },
    signal
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${res.statusText} | ${text}`);
  }
  return res.json();
}

const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

/**
 * Faz uma requisição POST para nosso backend FastAPI e retorna JSON.
 * Esta função é usada para gerar o simulado.
 * @param {string} path - caminho relativo (ex: "/gerar-simulado/unicamp")
 * @param {object} body - O objeto de dados a ser enviado (as opções do simulado)
 * @param {{signal?: AbortSignal, headers?: Record<string,string>}} opts 
 * @returns {Promise<any>}
 */
export async function apiPost(path, body, { signal, headers } = {}) {
  // Constrói a URL completa para o backend local
  const url = `${FASTAPI_BASE_URL}${path}`;
  
  // Log útil no console do navegador
  console.log("-> POST:", url, body);
  
  const res = await fetch(url, {
    method: "POST", // Método POST para enviar dados
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json", // Essencial para o FastAPI entender o JSON
      ...(headers || {})
    },
    body: JSON.stringify(body), // Transforma o objeto JS em texto JSON
    signal
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Tenta extrair a 'detail' do erro do FastAPI
    try {
      const errJson = JSON.parse(text);
      if (errJson.detail) {
        throw new Error(`Erro do Servidor: ${errJson.detail}`);
      }
    } catch (e) {
      // Falha no parse, só joga o erro HTTP
    }
    throw new Error(`HTTP ${res.status} - ${res.statusText} | ${text}`);
  }
  
  // Se a resposta for OK, retorna o JSON (a lista de questões)
  return res.json();
}


/**
 * Faz a requisição de Login para o backend FastAPI.
 * Endpoint: /token
 */
export async function apiLogin(username, password) {
  const url = `${FASTAPI_BASE_URL}/token`;
  
  // O endpoint /token do FastAPI espera form-urlencoded
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  console.log("-> LOGIN:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params, 
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    if (errData && errData.detail) {
      throw new Error(errData.detail);
    }
    throw new Error(`HTTP ${res.status} - Falha no login`);
  }

  return res.json();
} 

// --- NOVO: FUNÇÃO DE CADASTRO (REGISTRO) ---

/**
 * Registra um novo usuário no backend.
 * Endpoint: POST /users/
 */
export async function apiRegister(userData) {
  const url = `${FASTAPI_BASE_URL}/users/`;
  
  console.log("-> REGISTER:", url, userData);

  // O backend espera JSON para a criação de usuário (UserCreate Pydantic model)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // Envia os dados em JSON
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const errJson = JSON.parse(text);
      if (errJson.detail) {
        throw new Error(errJson.detail); // Ex: Username já registrado
      }
    } catch (e) { /* ignora erro de parse */ }
    throw new Error(`Erro ao registrar: ${text}`);
  }

  return res.json(); // Retorna os dados do novo usuário
}