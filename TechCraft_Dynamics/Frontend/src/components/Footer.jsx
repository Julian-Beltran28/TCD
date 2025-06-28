// src/components/Footer.jsx
import React from 'react';
import '../components/css/Footer.css';
import icono from '../assets/IconoTech.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={icono} alt="Logo TCD" />
          <h4>TECHCRAFT DYNAMICS</h4>
        </div>

        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://wa.me/573001112222" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-whatsapp"></i>
          </a>
          <a href="https://github.com/REDMAN8883/TCD" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-github"></i>
          </a>
        </div>

        <p className="footer-copy">&copy; 2025 TechCraft Dynamics. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
