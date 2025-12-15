from sqlalchemy.orm import Session
from database import SessionLocal, engine 
import models_db as models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db():
    
    # Создание таблиц
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Проверяем структуру базы
        table_count = len(models.Base.metadata.tables)
        logger.info(f"✅ База данных инициализирована. Таблиц: {table_count}")
        
        # МОЖНО ДОБАВИТЬ БАЗОВЫЕ ДАННЫЕ, ЕСЛИ НУЖНО (опционально)
        # Например, админ пользователь или базовые категории
        
        db.commit()
        
    except Exception as e:
        logger.error(f"❌ Ошибка при инициализации базы данных: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()