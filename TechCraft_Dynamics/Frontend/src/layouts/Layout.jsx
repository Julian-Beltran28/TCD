// src/layouts/Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Encabezado */}
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-2xl font-bold">Sistema de Gestión</h1>
      </header>

      <div className="flex flex-1">
        {/* Barra lateral */}
        <aside className="w-64 bg-white p-4 shadow">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="hover:text-blue-600 font-medium">Proveedores</Link>
            <Link to="/registrar" className="hover:text-blue-600 font-medium">Registrar Proveedor</Link>
            <Link to="/categorias" className="hover:text-blue-600 font-medium">Categorías</Link>
            <Link to="/categorias/listado" className="hover:text-blue-600 font-medium">Listar Categorías</Link>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Pie de página */}
      <footer className="bg-gray-200 text-center py-2 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Sistema de Gestión
      </footer>
    </div>
  );
};

export default Layout;
