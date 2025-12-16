from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from config import settings


# Создание директории для базы данных
os.makedirs("data", exist_ok=True)


# Подключение к SQLite базе данных
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL


# Создание движка базы данных
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True  # Логирование SQL запросов
)


# Создание фабрики сессий
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False
)


# Базовый класс для моделей
class Base(DeclarativeBase):
    pass


# Зависимость для получения сессии базы данных
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()