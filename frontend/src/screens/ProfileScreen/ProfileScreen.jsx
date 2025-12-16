import React, { useState, useEffect, useRef } from 'react';
import UserService from '../../services/UserService';
import AuthService from '../../services/AuthService';
import './ProfileScreen.css';

const ProfileScreen = ({ user, onUpdateProfile }) => {
  const fileInputRef = useRef(null);
  
  // Состояния профиля
  const [profile, setProfile] = useState({
    // Бэкендные поля (сохраняются на сервер)
    city: '',
    yoga_style: '',
    experience: '',
    goals: '',
    
    // Локальные поля (только в localStorage)
    username: '', // Будет заполнено из бэкенда, но не редактируемое
    age: '',
    contactInfo: '',
    knownStyles: '',
    healthInfo: '',
    preferredFormat: '',
    meetingFrequency: '',
    mentorshipDuration: '',
    communicationStyle: '',
    mentorPreferences: '',
    additionalInfo: '',
    photo: null
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка профиля при монтировании
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Получаем ID пользователя
      const userId = user?.id || (AuthService.getCurrentUser()?.id);
      if (!userId) {
        throw new Error('Пользователь не найден');
      }

      // 1. Загружаем данные с сервера
      console.log('ProfileScreen: Loading profile from server...');
      const serverProfile = await UserService.getProfile();
      setCurrentUser(serverProfile);
      
      // 2. Загружаем локальные данные
      const localProfile = UserService.getLocalProfile(userId);
      
      // 3. Объединяем данные
      const mergedProfile = {
        // Бэкендные поля
        city: serverProfile.city || '',
        yoga_style: serverProfile.yoga_style || '',
        experience: serverProfile.experience || '',
        goals: serverProfile.goals || '',
        username: serverProfile.username || '', // Берем username из бэкенда
        
        // Локальные поля
        age: localProfile.age || '',
        contactInfo: localProfile.contactInfo || '',
        knownStyles: localProfile.knownStyles || localProfile.yoga_style || '',
        healthInfo: localProfile.healthInfo || '',
        preferredFormat: localProfile.preferredFormat || '',
        meetingFrequency: localProfile.meetingFrequency || '',
        mentorshipDuration: localProfile.mentorshipDuration || '',
        communicationStyle: localProfile.communicationStyle || '',
        mentorPreferences: localProfile.mentorPreferences || '',
        additionalInfo: localProfile.additionalInfo || '',
        photo: localProfile.photo || null
      };
      
      setProfile(mergedProfile);
      
      // Устанавливаем фото превью
      if (localProfile.photo) {
        setPhotoPreview(localProfile.photo);
      }
      
      console.log('ProfileScreen: Profile loaded successfully');
      
    } catch (error) {
      console.error('ProfileScreen: Error loading profile:', error);
      setError(error.message || 'Ошибка загрузки профиля');
      
      // Fallback: пытаемся загрузить только локальные данные
      try {
        const userId = user?.id || (AuthService.getCurrentUser()?.id);
        if (userId) {
          const localProfile = UserService.getLocalProfile(userId);
          setProfile(prev => ({ 
            ...prev, 
            ...localProfile,
            username: user?.username || AuthService.getCurrentUser()?.username || ''
          }));
          
          if (localProfile.photo) {
            setPhotoPreview(localProfile.photo);
          }
        }
      } catch (localError) {
        console.error('ProfileScreen: Error loading local profile:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Редактирование полей
  const startEditing = (fieldName, currentValue) => {
    // Не разрешаем редактировать username
    if (fieldName === 'username') {
      alert('Имя пользователя нельзя изменить');
      return;
    }
    setEditingField(fieldName);
    setTempValue(currentValue);
  };

  const saveField = async () => {
    if (editingField && tempValue !== undefined) {
      const fieldName = editingField;
      const newValue = tempValue;
      
      // Обновляем локальное состояние
      const updatedProfile = {
        ...profile,
        [fieldName]: newValue
      };
      setProfile(updatedProfile);
      
      setEditingField(null);
      setTempValue('');
      
      // Автосохранение только для бэкендных полей
      const backendFields = ['city', 'yoga_style', 'experience', 'goals'];
      if (backendFields.includes(fieldName)) {
        await saveProfileToBackend(updatedProfile);
      } else {
        // Для локальных полей сохраняем сразу
        await saveLocalProfile(updatedProfile);
      }
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveField();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Сохранение профиля в бэкенд
  const saveProfileToBackend = async (profileData) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const backendData = {
        city: profileData.city || null,
        yoga_style: profileData.yoga_style || null,
        experience: profileData.experience || null,
        goals: profileData.goals || null
      };
      
      console.log('ProfileScreen: Saving to backend:', backendData);
      const updatedUser = await UserService.updateProfile(backendData);
      
      // Обновляем текущего пользователя
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Вызываем callback из MainScreen если он есть
      if (onUpdateProfile && currentUser?.id) {
        onUpdateProfile(currentUser.id, backendData);
      }
      
    } catch (error) {
      console.error('ProfileScreen: Error saving to backend:', error);
      setError(error.body?.detail || error.message || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  // Сохранение локального профиля
  const saveLocalProfile = async (profileData) => {
    try {
      const userId = currentUser?.id || user?.id;
      if (!userId) return;
      
      const localData = {
        age: profileData.age,
        contactInfo: profileData.contactInfo,
        knownStyles: profileData.knownStyles,
        healthInfo: profileData.healthInfo,
        preferredFormat: profileData.preferredFormat,
        meetingFrequency: profileData.meetingFrequency,
        mentorshipDuration: profileData.mentorshipDuration,
        communicationStyle: profileData.communicationStyle,
        mentorPreferences: profileData.mentorPreferences,
        additionalInfo: profileData.additionalInfo,
        photo: profileData.photo
      };
      
      UserService.saveLocalProfile(userId, localData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('ProfileScreen: Error saving local profile:', error);
    }
  };

  // Обработка загрузки фото
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Пожалуйста, выберите изображение (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPhotoPreview(base64String);
      
      // Обновляем профиль
      const updatedProfile = {
        ...profile,
        photo: base64String
      };
      setProfile(updatedProfile);
      
      // Сохраняем локально
      const userId = currentUser?.id || user?.id;
      if (userId) {
        UserService.saveProfilePhoto(userId, base64String);
      }
      
      setIsUploadingPhoto(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    };

    reader.onerror = () => {
      alert('Ошибка при загрузке фото');
      setIsUploadingPhoto(false);
    };

    reader.readAsDataURL(file);
  };

  // Функция для клика по фото
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const removePhoto = () => {
    if (window.confirm('Удалить фото профиля?')) {
      setPhotoPreview(null);
      
      const updatedProfile = {
        ...profile,
        photo: null
      };
      setProfile(updatedProfile);
      
      // Удаляем из localStorage
      const userId = currentUser?.id || user?.id;
      if (userId) {
        UserService.saveProfilePhoto(userId, null);
      }
    }
  };

  // Сохранение всех данных
  const handleSaveAll = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Сохраняем бэкендные поля
      await saveProfileToBackend(profile);
      
      // Сохраняем локальные поля
      await saveLocalProfile(profile);
      
    } catch (error) {
      console.error('ProfileScreen: Error saving all:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Специальный рендер для неизменяемого поля
  const renderReadOnlyField = (label, fieldName, value) => {
    return (
      <div className="profile-field" key={fieldName}>
        <div className="field-header">
          <label className="field-label">
            {label}:
            <span className="read-only-badge" title="Нельзя изменить">🔒</span>
          </label>
        </div>
        <div className="field-value read-only">
          {value || 'Не указано'}
        </div>
      </div>
    );
  };

  // Рендер поля с учетом типа
  const renderField = (label, fieldName, value, isTextArea = false, isBackendField = false) => {
    // Для поля username используем специальный рендер
    if (fieldName === 'username') {
      return renderReadOnlyField(label, fieldName, value);
    }
    
    const isEditing = editingField === fieldName;
    
    return (
      <div className="profile-field" key={fieldName}>
        <div className="field-header">
          <label className="field-label">
            {label}:
            {isBackendField && (
              <span className="backend-badge" title="Синхронизируется с сервером">🌐</span>
            )}
          </label>
          {!isEditing && value && (
            <button 
              className="profile-edit-btn"
              onClick={() => startEditing(fieldName, value)}
              aria-label={`Редактировать ${label.toLowerCase()}`}
            >
              ✎
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="edit-container">
            {isTextArea ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="profile-textarea"
                rows="3"
                autoFocus
                placeholder={`Введите ${label.toLowerCase()}`}
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="profile-input"
                autoFocus
                placeholder={`Введите ${label.toLowerCase()}`}
              />
            )}
            <div className="edit-actions">
              <button 
                className="save-small-btn"
                onClick={saveField}
                disabled={isSaving}
                aria-label="Сохранить"
              >
                ✓
              </button>
              <button 
                className="cancel-small-btn"
                onClick={cancelEditing}
                aria-label="Отмена"
              >
                ✕
              </button>
            </div>
          </div>
        ) : value ? (
          <div className="field-value">
            {value}
          </div>
        ) : (
          <button 
            className="add-btn"
            onClick={() => startEditing(fieldName, '')}
          >
            + Добавить
          </button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-card">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <div className="profile-layout">
            {/* Левая колонка - фото и личная информация */}
            <div className="profile-left">
              <div className="photo-section">
                <div 
                  className={`photo-placeholder ${photoPreview ? 'has-photo' : ''}`}
                  onClick={handlePhotoClick}
                >
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Фото профиля" 
                      className="profile-photo"
                    />
                  ) : (
                    <div className="photo-text">
                      <div className="camera-icon">📷</div>
                      <div>Добавить фото</div>
                    </div>
                  )}
                  <div className="photo-overlay">
                    <span className="upload-text">
                      {isUploadingPhoto ? 'Загрузка...' : 'Изменить фото'}
                    </span>
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="file-input"
                  disabled={isUploadingPhoto}
                />
                
                <div className="photo-actions">
                  {photoPreview && (
                    <button 
                      className="remove-btn"
                      onClick={removePhoto}
                      disabled={isUploadingPhoto}
                    >
                      {isUploadingPhoto ? 'Загрузка...' : 'Удалить фото'}
                    </button>
                  )}
                </div>
                
                <div className="photo-hint">
                  JPG, PNG, GIF до 5MB
                </div>
              </div>
            </div>

            {/* Правая колонка - поля анкеты */}
            <div className="profile-right">
              <div className="sections-container">
                <div className="profile-section">
                  <h3>ОБО МНЕ</h3>
                  {renderField('Имя пользователя', 'username', profile.username)}
                  {renderField('Возраст', 'age', profile.age)}
                  {renderField('Город', 'city', profile.city, false, true)}
                  {renderField('Контактные данные', 'contactInfo', profile.contactInfo, true)}
                </div>

                <div className="profile-section">
                  <h3>ОПЫТ В ЙОГЕ</h3>
                  {renderField('Стаж практики', 'experience', profile.experience, false, true)}
                  {renderField('Знакомые стили', 'knownStyles', profile.knownStyles, true)}
                  {renderField('Предпочитаемый стиль', 'yoga_style', profile.yoga_style, false, true)}
                </div>

                <div className="profile-section">
                  <h3>ЦЕЛИ И ЗАПРОСЫ</h3>
                  {renderField('Основные цели', 'goals', profile.goals, true, true)}
                  {renderField('Состояние здоровья', 'healthInfo', profile.healthInfo, true)}
                </div>

                <div className="profile-section">
                  <h3>ФОРМАТ РАБОТЫ</h3>
                  {renderField('Формат занятий', 'preferredFormat', profile.preferredFormat)}
                  {renderField('Частота встреч', 'meetingFrequency', profile.meetingFrequency)}
                  {renderField('Срок работы', 'mentorshipDuration', profile.mentorshipDuration)}
                </div>

                <div className="profile-section">
                  <h3>ПРЕДПОЧТЕНИЯ</h3>
                  {renderField('Стиль общения', 'communicationStyle', profile.communicationStyle, true)}
                  {renderField('Требования к ментору', 'mentorPreferences', profile.mentorPreferences, true)}
                </div>

                <div className="profile-section">
                  <h3>ДОПОЛНИТЕЛЬНО</h3>
                  {renderField('Дополнительная информация', 'additionalInfo', profile.additionalInfo, true)}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <div className="footer-actions">
              <div className="save-section">
                {saveSuccess && (
                  <div className="save-success">
                    ✓ Изменения сохранены
                  </div>
                )}
                <button 
                  className="save-btn" 
                  onClick={handleSaveAll}
                  disabled={isSaving}
                >
                  {isSaving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ВСЁ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;