from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Настройки JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:///./data/yogavibe.db"
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"


settings = Settings()