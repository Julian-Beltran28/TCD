// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Ventas from './pages/Ventas';
import Compras from './pages/compras';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="ventas" element={<Ventas />} />
          <Route path="compras" element={<Compras />} />
          <Route path="perfil" element={<div>Perfil</div>} />
          <Route path="usuarios" element={<div>Usuarios</div>} />
          <Route path="categorias" element={<div>Categorías</div>} />
          <Route path="proveedores" element={<div>Proveedores</div>} />
          <Route path="reportes" element={<div>Reportes</div>} />

        </Route>
      </Routes>

    </BrowserRouter>
  );
}
