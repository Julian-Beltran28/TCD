// src/layouts/AdminLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true); // Empieza visible

  return (
    <div className="app-container d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Sidebar isOpen={isOpen} />

      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: isOpen ? '260px' : '1rem',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
        }}
      >
        ☰
      </button>

      <div
        className="main-content"
        style={{
          marginLeft: isOpen ? '250px' : '0',
          transition: 'margin-left 0.3s ease',
          padding: '4rem 2rem 2rem 2rem',
          flexGrow: 1,
          overflow: 'visible',
        }}
      >
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
