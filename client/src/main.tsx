import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // Initialize i18n localization engine

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
