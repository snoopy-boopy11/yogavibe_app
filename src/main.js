import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Точка входа приложения - рендерим корневой компонент
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);