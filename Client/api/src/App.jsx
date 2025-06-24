import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CrearProveedor from './components/CrearProveedor';
import ListarProveedores from './components/ListarProveedores';
import ActualizarProveedor from './components/ActualizarProveedor';
import React from 'react';
import './App.css';
import './css/ListarProveedores.css';
import './css/CrearProveedor.css';
import './css/ActualizarProveedor.css';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <h1 className='titulo'>Proveedores</h1>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
            </ul>
          </div>
      </nav>
      <Routes>
        <Route path="/registrar" element={<CrearProveedor />} />
        <Route path="/" element={<ListarProveedores />} />
        <Route path="/actualizar/:id" element={<ActualizarProveedor />} />
      </Routes>
    </Router>
  );
}

export default App;
