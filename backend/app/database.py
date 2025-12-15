from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os


# Создание директории для базы данных
os.makedirs("data", exist_ok=True)


# Подключение к SQLite базе данных
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/yogavibe.db"


# Создание движка базы данных
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True  # Логирование SQL запросов (для разработки)
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
def get_db():
    # Получение сессии базы данных
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()