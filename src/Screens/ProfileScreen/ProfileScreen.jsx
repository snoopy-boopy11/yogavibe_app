import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileScreen.css';

const ProfileScreen = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Состояние профиля
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    city: '',
    contactInfo: '',
    experienceYears: '',
    knownStyles: '',
    goals: '',
    healthInfo: '',
    preferredFormat: '',
    meetingFrequency: '',
    mentorshipDuration: '',
    communicationStyle: '',
    mentorPreferences: '',
    additionalInfo: '',
    photo: null
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Загрузка профиля при монтировании
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const userId = user?.id || JSON.parse(localStorage.getItem('yogavibe_user')).id;
      const allProfiles = JSON.parse(localStorage.getItem('yogavibe_profiles') || '{}');
      const userProfile = allProfiles[userId] || profile;
      
      if (userProfile.photo) {
        setPhotoPreview(userProfile.photo);
      }
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
    }
  };

  const startEditing = (fieldName, currentValue) => {
    setEditingField(fieldName);
    setTempValue(currentValue);
  };

  const saveField = () => {
    if (editingField && tempValue !== undefined) {
      const updatedProfile = {
        ...profile,
        [editingField]: tempValue
      };
      
      setProfile(updatedProfile);
      setEditingField(null);
      setTempValue('');
      saveProfile(updatedProfile);
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveField();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Пожалуйста, выберите изображение');
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
      
      const updatedProfile = {
        ...profile,
        photo: base64String
      };
      
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
      setIsUploadingPhoto(false);
    };

    reader.onerror = () => {
      alert('Ошибка при загрузке фото');
      setIsUploadingPhoto(false);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
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
      saveProfile(updatedProfile);
    }
  };

  const saveProfile = async (profileData = null) => {
    setIsSaving(true);
    
    try {
      const profileToSave = profileData || profile;
      const userId = user?.id || JSON.parse(localStorage.getItem('yogavibe_user')).id;
      
      const allProfiles = JSON.parse(localStorage.getItem('yogavibe_profiles') || '{}');
      allProfiles[userId] = profileToSave;
      localStorage.setItem('yogavibe_profiles', JSON.stringify(allProfiles));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = () => {
    saveProfile();
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти из аккаунта?')) {
      onLogout();
      navigate('/login');
    }
  };

  const renderField = (label, fieldName, value, isTextArea = false) => {
    const isEditing = editingField === fieldName;
    
    return (
      <div className="profile-field" key={fieldName}>
        <div className="field-header">
          <label className="field-label">{label}:</label>
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

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-layout">
            {/* Левая колонка - только фото */}
            <div className="profile-left">
              <div className="photo-section">
                <div 
                  className={`photo-placeholder ${photoPreview ? 'has-photo' : ''}`}
                  onClick={triggerFileInput}
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
                    <span className="upload-text">Изменить фото</span>
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="file-input"
                />
                
                <div className="photo-actions">
                  {photoPreview && (
                    <button 
                      className="remove-btn"
                      onClick={removePhoto}
                    >
                      Удалить фото
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
                  {renderField('ФИО', 'fullName', profile.fullName)}
                  {renderField('Возраст', 'age', profile.age)}
                  {renderField('Город', 'city', profile.city)}
                  {renderField('Контактные данные', 'contactInfo', profile.contactInfo, true)}
                </div>

                <div className="profile-section">
                  <h3>ОПЫТ В ЙОГЕ</h3>
                  {renderField('Стаж практики', 'experienceYears', profile.experienceYears)}
                  {renderField('Знакомые стили', 'knownStyles', profile.knownStyles, true)}
                </div>

                <div className="profile-section">
                  <h3>ЦЕЛИ И ЗАПРОСЫ</h3>
                  {renderField('Основные цели', 'goals', profile.goals, true)}
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