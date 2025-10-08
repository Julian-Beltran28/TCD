// src/components/Footer.jsx
// Importaciones necesarias
import React from 'react';
// Importacion de la imagen TechCraft
import icono from '../assets/IconoTech.png';
// Css
import '../css/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          {/* Imagen de TechCraft */}
          <img src={icono} alt="Logo TCD" />
         
        </div>
        {/* Redes sociales de TechCraft */}
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> {/* Facebook */}
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> {/* Instagram */}
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://wa.me/573001112222" target="_blank" rel="noopener noreferrer"> {/* WhatsApp */}
            <i className="bi bi-whatsapp"></i>
          </a>
          <a href="https://github.com/REDMAN8883/TCD" target="_blank" rel="noopener noreferrer"> {/* Github de nuestro repo */}
            <i className="bi bi-github"></i>
          </a>
        </div>

        <p className="footer-copy">&copy; 2025 TechCraft Dynamics. Todos los derechos reservados.</p>  {/* Derechos de autor */}
      </div>
    </footer>
  );
}
