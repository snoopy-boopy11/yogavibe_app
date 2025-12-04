import React, { useState, useRef, useEffect } from 'react';
import './NotesScreen.css';

const NotesScreen = ({ 
  notes, 
  editingNoteId, 
  editingText, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote, 
  onStartEditing, 
  onSaveEditing, 
  onCancelEditing,
  onSetEditingText 
}) => {
  // Состояние для новой заметки
  const [newNote, setNewNote] = useState('');

  // Реф для отслеживания кликов вне области редактирования
  const editModeRef = useRef(null);

  // Добавление новой заметки
  const handleAddNote = () => {
    const trimmedText = newNote.trim();
    if (trimmedText === '') return;
    
    onAddNote(trimmedText);
    setNewNote('');
  };

  // Удаление заметки
  const handleDeleteNote = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
      onDeleteNote(id);
    }
  };

  // Обработка нажатия Enter для добавления заметки
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  // Обработчик клика вне поля редактирования
  const handleClickOutside = (e) => {
    if (editingNoteId && editModeRef.current && !editModeRef.current.contains(e.target)) {
      if (editingText.trim() !== '') {
        onSaveEditing(editingNoteId);
      } else {
        onCancelEditing();
      }
    }
  };

  // Добавляем обработчик кликов при монтировании
  useEffect(() => {
    if (editingNoteId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingNoteId, editingText]);

  // Фокус на поле ввода при редактировании
  useEffect(() => {
    if (editingNoteId && editModeRef.current) {
      const textarea = editModeRef.current.querySelector('.note-edit-textarea');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }
  }, [editingNoteId]);

  return (
    <div className="notes-page">
      <div className="notes-container">
        {/* Заголовок раздела заметок */}
        <div className="notes-header">
          <h2>Мои заметки</h2>
          <p>Записывайте свои мысли, идеи и наблюдения о практике йоги</p>
        </div>

        {/* Форма для добавления новой заметки */}
        <div className="add-note-section">
          <div className="note-input-container">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите свою заметку..."
              className="note-textarea"
              rows="4"
              aria-label="Поле для ввода новой заметки"
            />
            <div className="note-input-actions">
              <button 
                onClick={handleAddNote}
                disabled={newNote.trim() === ''}
                className="add-note-btn"
                aria-label="Добавить заметку"
              >
                Добавить заметку
              </button>
              <span className="char-count">{newNote.length}/1000</span>
            </div>
          </div>
        </div>

        {/* Контейнер со списком заметок */}
        <div className="notes-content">
          <div className="notes-list-container">
            <div className="notes-list">
              {notes.length === 0 ? (
                // Сообщение при отсутствии заметок
                <div className="no-notes">
                  <p>У вас пока нет заметок</p>
                  <span>Начните добавлять свои мысли и наблюдения!</span>
                </div>
              ) : (
                // Список заметок
                notes.map((note) => (
                  <div key={note.id} className="note-card">
                    {editingNoteId === note.id ? (
                      // Режим редактирования заметки
                      <div className="note-edit-mode" ref={editModeRef}>
                        <textarea
                          value={editingText}
                          onChange={(e) => onSetEditingText(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, note.id)}
                          className="note-edit-textarea"
                          rows="4"
                          maxLength="1000"
                          aria-label="Редактирование заметки"
                        />
                        <div className="note-edit-info">
                          <span className="edit-char-count">{editingText.length}/1000</span>
                          <div className="edit-hint">Ctrl+Enter для сохранения, Esc для отмены</div>
                        </div>
                        <div className="note-edit-actions">
                          <button 
                            onClick={() => onSaveEditing(note.id)}
                            disabled={editingText.trim() === ''}
                            className="save-btn"
                            aria-label="Сохранить изменения"
                          >
                            Сохранить
                          </button>
                          <button 
                            onClick={onCancelEditing}
                            className="cancel-btn"
                            aria-label="Отменить редактирование"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Режим просмотра заметки
                      <>
                        <div className="note-content">
                          <p>{note.text}</p>
                        </div>
                        <div className="note-footer">
                          <div className="note-dates">
                            <span className="note-date">
                              Создано: {note.createdAt}
                            </span>
                            {note.updatedAt !== note.createdAt && (
                              <span className="note-updated">
                                Изменено: {note.updatedAt}
                              </span>
                            )}
                          </div>
                          <div className="note-actions">
                            <button 
                              onClick={() => onStartEditing(note)}
                              className="edit-btn"
                              aria-label="Редактировать заметку"
                            >
                              Редактировать
                            </button>
                            <button 
                              onClick={() => handleDeleteNote(note.id)}
                              className="delete-btn"
                              aria-label="Удалить заметку"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesScreen;