// components/ToastNotification.jsx
// Importaciones necesarias
import { useEffect } from 'react';
// Css
import '../css/ToastNotification.css'; 

// Muestra la notificacion dependiendo del inicio de sesion 
const ToastNotification = ({ message, type, isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration); // Tiempo de vista de la notificacion 

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  // Dependiendo del inicio de sesion muestra el icono correspondiente 
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  return (
    <div className={`toast-notification toast-${type} ${isVisible ? 'toast-show' : ''}`}>
      <div className="toast-content">
        {/* Muestra el icono correspondiente */}
        <span className="toast-icon">{getIcon()}</span>
        {/* Muestra el mensaje correspondiente */}
        <span className="toast-message">{message}</span>
        {/* Boton para cerrar el notificacion */}
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      </div>
      {/* Animacion para la notificacion */}
      <div className="toast-progress">
        <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
      </div>
    </div>
  );
};

export default ToastNotification;