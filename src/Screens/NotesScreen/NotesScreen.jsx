// src/screens/NotesScreen/NotesScreen.jsx
import React, { useState } from 'react';
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
  // Состояние для новой заметки (локальное, так как только для формы ввода)
  const [newNote, setNewNote] = useState('');

  // Добавление новой заметки
  const handleAddNote = () => {
    if (newNote.trim() === '') return;
    onAddNote(newNote);
    setNewNote('');
  };

  // Удаление заметки
  const handleDeleteNote = (id) => {
    onDeleteNote(id);
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
    if (editingNoteId && !e.target.closest('.note-edit-mode')) {
      onCancelEditing();
    }
  };

  return (
    <div className="notes-page" onClick={handleClickOutside}>
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
            <button 
              onClick={handleAddNote}
              disabled={newNote.trim() === ''}
              className="add-note-btn"
              aria-label="Добавить заметку"
            >
              Добавить заметку
            </button>
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
                      <div className="note-edit-mode">
                        <textarea
                          value={editingText}
                          onChange={(e) => onSetEditingText(e.target.value)}
                          className="note-edit-textarea"
                          rows="4"
                          autoFocus
                          aria-label="Редактирование заметки"
                        />
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
                          <span className="note-date">
                            Создано: {note.createdAt}
                            {note.updatedAt !== note.createdAt && (
                              <span className="note-updated">
                                (изменено: {note.updatedAt})
                              </span>
                            )}
                          </span>
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