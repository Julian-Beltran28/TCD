// src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import CodigoBarras from './components/ventas/Ingreso_ventas';
import TablaProductos from './components/ventas/Lista_Productos';
import ListaVentas from './components/ventas/ListaVentas';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="app-container d-flex flex-column"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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

function IngresoVentasPage() {
  return (
    <div>
      <CodigoBarras />
      <TablaProductos />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="IngresoVentas" element={<IngresoVentasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
