// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Iconos de Bootstrap (asegúrate de tener instalado bootstrap-icons)
import 'bootstrap-icons/font/bootstrap-icons.css';

// Punto de montaje
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
