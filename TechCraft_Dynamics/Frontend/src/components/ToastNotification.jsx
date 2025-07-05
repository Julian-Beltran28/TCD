// components/ToastNotification.jsx
import { useEffect } from 'react';
import '../css/ToastNotification.css'; 

const ToastNotification = ({ message, type, isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

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
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
      </div>
    </div>
  );
};

export default ToastNotification;