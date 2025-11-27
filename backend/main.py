# Em: backend/main.py

import os
import re
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# --- Imports de Segurança ---
from typing import Optional, Annotated
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt

# --- NOVO: Imports de Banco de Dados ---
from sqlalchemy.orm import Session
import models
from database import SessionLocal, engine

# --- Configuração Inicial ---

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')

if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY não encontrada no arquivo .env")
if not SECRET_KEY:
    raise EnvironmentError("SECRET_KEY não encontrada no arquivo .env")

genai.configure(api_key=GEMINI_API_KEY)

# --- NOVO: Cria as tabelas no banco de dados automaticamente ---
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Simulados",
    description="Gera questões de vestibular usando IA",
    version="1.0.0"
)

# --- CORS ---
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependência do Banco de Dados ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Configuração de Segurança ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Modelos de Dados (Pydantic) ---

class SimuladoRequest(BaseModel):
    dificuldade: str
    materia: str
    numQuestoes: int

class Opcao(BaseModel):
    id: int
    texto: str

class QuestaoResponse(BaseModel):
    id: str
    vestibular: str
    materia: str
    dificuldade: str
    enunciado: str
    opcoes: list[Opcao]
    respostaCorreta: int 

# Modelos para Usuário (NOVO)
class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    role: str = "free"

class UserResponse(BaseModel):
    username: str
    email: Optional[str] = None
    role: str
    class Config:
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- Funções Auxiliares de Segurança ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Dependência de Usuário Atual (USA O DB) ---

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    # BUSCA NO BANCO DE DADOS REAL
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    
    if user is None:
        raise credentials_exception
    return user

# --- Funções Auxiliares da IA ---

def construir_prompt(vestibular_id: str, req: SimuladoRequest):
    return f"""
    Gere {req.numQuestoes} questões de múltipla escolha para um simulado de vestibular.
    Formato da Resposta: JSON
    Regras Estritas:
    1. Vestibular: {vestibular_id.upper()}
    2. Matéria: {req.materia}
    3. Nível de Dificuldade: {req.dificuldade}
    4. 4 opções (A, B, C, D).
    5. A resposta correta DEVE ser um número (0, 1, 2, ou 3).
    6. O JSON de saída deve ser uma lista de objetos.
    7. Não inclua "```json" ou "```" no início ou fim da resposta.
    8. O ID da questão deve ser único (ex: 'q1', 'q2').
    """

def limpar_json(texto_bruto):
    return re.sub(r'```json\s*|\s*```', '', texto_bruto.strip())


# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "API com Banco de Dados SQLite Online!"}

# --- Registro de Usuário (ENDPOINT NOVO) ---
@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Verifica se já existe
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário (username) já registrado")
    
    # 2. Cria o novo usuário
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        username=user.username, 
        email=user.email, 
        role=user.role, 
        hashed_password=hashed_password
    )
    
    # 3. Salva no banco
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# --- Login (BUSCA NO DB) ---
@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    # Busca no banco
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Gerar Simulado (USA USER DO DB) ---

@app.post("/gerar-simulado/{vestibular_id}", response_model=list[QuestaoResponse])
async def gerar_simulado(
    vestibular_id: str, 
    request_data: SimuladoRequest,
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    print(f"Usuário '{current_user.username}' (role: {current_user.role}) pediu simulado.")

    if current_user.role == "free" and request_data.numQuestoes > 5:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuários 'free' só podem gerar até 5 questões por vez. Faça upgrade para 'premium'."
        )
    
    if current_user.role == "premium" and request_data.numQuestoes > 50:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuários 'premium' têm limite de 50 questões por vez."
        )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-pro') 
        prompt = construir_prompt(vestibular_id, request_data)
        response = model.generate_content(prompt)
        
        json_texto = limpar_json(response.text)
        questoes_json = json.loads(json_texto)
        
        questoes_formatadas = []
        for q in questoes_json:
            q['vestibular'] = vestibular_id.upper()
            q['materia'] = request_data.materia
            q['dificuldade'] = request_data.dificuldade
            questoes_formatadas.append(q)
            
        return questoes_formatadas

    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON da IA: {e}")
        raise HTTPException(status_code=500, detail="IA retornou JSON inválido.")
    except Exception as e:
        print(f"Erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno.")