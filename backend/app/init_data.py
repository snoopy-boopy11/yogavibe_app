from sqlalchemy import inspect
from sqlalchemy.orm import Session
from database import Base, SessionLocal, engine 
import models_db as models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Проверяем, существуют ли основные таблицы
def check_tables_exist() -> bool:
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # Ключевые таблицы, которые должны быть
    required_tables = ["users", "mentors", "notes", "bookings", "refresh_tokens"]
    
    # Проверяем наличие всех ключевых таблиц
    return all(table in existing_tables for table in required_tables)


# Создать таблицы только если их нет
def create_tables_if_not_exist():
    if not check_tables_exist():
        logger.info("Создание таблиц базы данных...")
        Base.metadata.create_all(bind=engine)
        
        inspector = inspect(engine)
        created_tables = inspector.get_table_names()
        logger.info(f"Создано таблиц: {len(created_tables)}")
        logger.info(f"Таблицы: {', '.join(created_tables)}")
        return True
    else:
        logger.info("Таблицы уже существуют")
        return False


# Получить статистику базы данных
def get_database_stats():
    db = SessionLocal()
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        stats = {"tables": len(tables)}
        
        # Подсчитываем записи в каждой таблице
        for table in tables:
            try:
                count = db.execute(f"SELECT COUNT(*) FROM {table}").scalar()
                stats[table] = count
            except:
                stats[table] = "error"
        
        return stats
    finally:
        db.close()



def init_db():
    logger.info("Проверка базы данных...")
    
    # Создаем таблицы если их нет
    created = create_tables_if_not_exist()
    
    if created:
        logger.info("База данных инициализирована")
    else:
        # Показываем статистику существующей БД
        stats = get_database_stats()
        logger.info("Статистика базы данных:")
        logger.info(f"  - Таблиц: {stats['tables']}")
        for table, count in stats.items():
            if table != "tables":
                logger.info(f"  - {table}: {count} записей")
    
    return created


if __name__ == "__main__":
    init_db()