# Em: backend/database.py (NOVO ARQUIVO)

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuração da URL do banco de dados (criará o arquivo sql_app.db)
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# Configura a conexão (necessário para SQLite)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para criar as tabelas
Base = declarative_base()