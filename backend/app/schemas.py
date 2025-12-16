from typing import Optional, List
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, EmailStr, field_serializer, validator, ConfigDict


# ---------- БАЗОВЫЕ СХЕМЫ ПОЛЬЗОВАТЕЛЕЙ ----------

class UserBase(BaseModel):
    """Базовая схема пользователя"""
    username: str
    email: EmailStr
    
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    """Схема для создания пользователя"""
    username: str
    email: EmailStr
    password: str
    
    @validator('email')
    def email_to_lower(cls, v: str) -> str:
        """Приводит email к нижнему регистру"""
        return v.lower()
    
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    """Схема для обновления пользователя"""
    city: Optional[str] = None
    yoga_style: Optional[str] = None
    experience: Optional[str] = None
    goals: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    """Схема ответа с пользователем"""
    id: int
    username: str
    email: str
    city: Optional[str] = None
    yoga_style: Optional[str] = None
    experience: Optional[str] = None
    goals: Optional[str] = None
    created_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)


# ---------- СХЕМЫ ДЛЯ АУТЕНТИФИКАЦИИ ----------

class LoginRequest(BaseModel):
    """Схема для входа в систему"""
    login: str      # email или username
    password: str
    
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Схема токенов"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
    model_config = ConfigDict(from_attributes=True)


class TokenRefreshRequest(BaseModel):
    """Схема для обновления токена"""
    refresh_token: str
    
    model_config = ConfigDict(from_attributes=True)


class AuthResponse(Token):
    """Схема ответа аутентификации"""
    user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)


# ---------- СХЕМЫ ДЛЯ МЕНТОРОВ ----------

class MentorBase(BaseModel):
    """Базовая схема ментора"""
    name: str
    description: str
    gender: str
    city: str
    price: int
    yoga_style: str
    
    model_config = ConfigDict(from_attributes=True)


class MentorCreate(MentorBase):
    """Схема для создания ментора"""
    rating: Optional[float] = 0.0
    experience_years: Optional[int] = 0
    photo_url: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class MentorResponse(MentorBase):
    """Схема ответа с ментором"""
    id: int
    rating: float
    experience_years: int
    photo_url: Optional[str] = None
    is_available: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ---------- СХЕМЫ ДЛЯ ЗАМЕТОК ----------

class NoteBase(BaseModel):
    """Базовая схема заметки"""
    text: str
    
    model_config = ConfigDict(from_attributes=True)


class NoteCreate(NoteBase):
    """Схема для создания заметки"""
    @validator('text')
    def validate_text_length(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Текст заметки не может быть пустым')
        if len(v) > 1000:
            raise ValueError('Текст заметки слишком длинный')
        return v


class NoteResponse(NoteBase):
    """Схема ответа с заметкой"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, dt: Optional[datetime], _info) -> Optional[str]:
        """Преобразование datetime в строку с временем Москвы"""
        if dt is None:
            return None
        
        # Если datetime без таймзоны, считаем что это UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        
        # Преобразуем в московское время (UTC+3)
        moscow_tz = timezone(timedelta(hours=3))
        moscow_time = dt.astimezone(moscow_tz)
        
        # Возвращаем в ISO формате
        return moscow_time.isoformat()
    

    model_config = ConfigDict(from_attributes=True)


# ---------- СХЕМЫ ДЛЯ БРОНИРОВАНИЙ ----------

class BookingBase(BaseModel):
    """Базовая схема бронирования"""
    mentor_id: int
    session_date: datetime
    duration_minutes: int = 60
    notes: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class BookingCreate(BookingBase):
    """Схема для создания бронирования"""
    pass


class BookingResponse(BookingBase):
    """Схема ответа с бронированием"""
    id: int
    user_id: int
    price: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class BookingUpdate(BaseModel):
    """Схема для обновления бронирования"""
    status: Optional[str] = None
    notes: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)