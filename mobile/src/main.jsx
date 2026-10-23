import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/skeuo.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://webchat-9vqr.onrender.com';
try {
  fetch(`${BACKEND_URL}/health`, { method: 'GET', keepalive: true }).catch(() => {});
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
