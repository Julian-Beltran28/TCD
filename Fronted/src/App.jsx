// Importaciones de rutas etc.
import { useState } from 'react';
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";

// importaciones de componentes
import Sidebar from "./components/Sidebar"; // Menu desplegable
import Categorias from "./components/Categorias"; // Categorias
import ListarCategorias from "./components/listarCategorias"; // Listado de categorias
import Subcategoria from './components/SubCategorias'; // Subcategorias

// Importaciones de las carpetas formsAdd y formsEdit
import Agregar from './components/formsAdd/Agregar'; // Componentes para agregar (Categorias, Subcategorias y productos)
import Editar from './components/formsEdit/Editar'; // Componentes para editar (Categorias, Subcategorias y productos)


function Layout(){
  const [isOpen, setIsOpen] = useState(false); {/* Comienza el sidebar cerrado */}

  return (
    <div className="app-container">
      {/* Sidebar con apertura y cierre */}
      <Sidebar isOpen={isOpen} />  

      
        {/* Boton fijo */}
        <button className="sidebar-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            top: '1rem',
            left: isOpen ? '260px' : '1rem', // Mover si se abre el Sidebar
            zIndex: 1000,
            transition: 'left 0.3s ease'
          }}>
          ☰
        </button>

        <div className="main-content"
        style={{
          marginLeft: isOpen ? '250px' : '0',
          transition: 'margin-left 0.3s ease',
          padding: '4rem 2rem 2rem 2rem',
          minHeight: '100vh',
          width: isOpen ? 'calc(100vw - 260px)' : '100vw' // Ocupar todo el ancho disponible
          
        }}>
        <Outlet />
        </div>
    </div>
  );
}

// Layout
// Zona importante ya que aca se maneja las rutas para el fronted
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rutas normales */}
          <Route path="Categorias" element={<Categorias />} />
          <Route path="Categorias/Listado" element={<ListarCategorias />} />
          <Route path="/Subcategorias" element={<Subcategoria />} />

          {/* Ruta para ir a la subcategoria deseada */}
          <Route path="Categoria/:idCategoria" element={<Subcategoria />} />

          {/* Rutas para elejir que va agregar y que va editar */}
          <Route path="agregar/:tipo" element={<Agregar />} />
          <Route path="editar/:tipo/:id" element={<Editar />} />
          
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
