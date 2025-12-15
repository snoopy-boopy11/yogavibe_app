from sqlalchemy.orm import Session
from database import SessionLocal, engine 
import models_db as models
from datetime import datetime

def add_test_mentors():
    db = SessionLocal()
    
    try:
        # Проверяем, есть ли уже менторы
        existing_mentors = db.query(models.Mentor).count()
        if existing_mentors > 0:
            print(f"✅ В базе уже есть {existing_mentors} менторов")
            return
        
        # Создаем тестовых менторов
        test_mentors = [
            models.Mentor(
                name="Анна Иванова",
                description="Опытный инструктор по хатха йоге с 5-летним стажем",
                gender="female",
                city="Москва",
                price=2500,
                yoga_style="Хатха",
                rating=4.8,
                experience_years=5,
                is_available=True
            ),
            models.Mentor(
                name="Дмитрий Петров",
                description="Специалист по аштанга йоге и медитации",
                gender="male",
                city="Санкт-Петербург",
                price=3000,
                yoga_style="Аштанга",
                rating=4.9,
                experience_years=7,
                is_available=True
            ),
            models.Mentor(
                name="Мария Сидорова",
                description="Йога для беременных и восстановительная йога",
                gender="female",
                city="Новосибирск",
                price=2000,
                yoga_style="Восстановительная",
                rating=4.7,
                experience_years=4,
                is_available=True
            ),
            models.Mentor(
                name="Алексей Козлов",
                description="Инструктор по силовой йоге и йоге для мужчин",
                gender="male",
                city="Екатеринбург",
                price=2800,
                yoga_style="Силовая",
                rating=4.6,
                experience_years=6,
                is_available=True
            ),
            models.Mentor(
                name="Елена Смирнова",
                description="Кундалини йога и работа с чакрами",
                gender="female",
                city="Москва",
                price=3200,
                yoga_style="Кундалини",
                rating=4.9,
                experience_years=8,
                is_available=True
            ),
            models.Mentor(
                name="Сергей Николаев",
                description="Йогатерапия и работа с травмами",
                gender="male",
                city="Казань",
                price=2700,
                yoga_style="Йогатерапия",
                rating=4.8,
                experience_years=5,
                is_available=True
            ),
            models.Mentor(
                name="Ольга Кузнецова",
                description="Йога для начинающих и стретчинг",
                gender="female",
                city="Нижний Новгород",
                price=1800,
                yoga_style="Для начинающих",
                rating=4.5,
                experience_years=3,
                is_available=True
            ),
            models.Mentor(
                name="Иван Морозов",
                description="Бикрам йога и горячая йога",
                gender="male",
                city="Челябинск",
                price=2900,
                yoga_style="Бикрам",
                rating=4.7,
                experience_years=4,
                is_available=True
            ),
            models.Mentor(
                name="Татьяна Павлова",
                description="Интегральная йога и философия",
                gender="female",
                city="Самара",
                price=2200,
                yoga_style="Интегральная",
                rating=4.6,
                experience_years=5,
                is_available=True
            ),
        ]
        
        db.add_all(test_mentors)
        db.commit()
        
        print(f"✅ Добавлено {len(test_mentors)} тестовых менторов")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка при добавлении тестовых данных: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    # Создаем таблицы, если их нет
    models.Base.metadata.create_all(bind=engine)
    
    # Добавляем тестовых менторов
    add_test_mentors()