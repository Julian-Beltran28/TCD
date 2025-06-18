import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CrearProveedor from './CrearProveedor';
import ListarProveedores from './ListarProveedores';
import ActualizarProveedor from './ActualizarProveedor';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Gestión de Proveedores</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Registrar Proveedor</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/listar">Listar Proveedores</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/registrar" element={<CrearProveedor />} /> {/* Cambié la ruta de registrar a "/" */}
        <Route path="/listar" element={<ListarProveedores />} />
        <Route path="/actualizar/:id" element={<ActualizarProveedor />} /> {/* Agregué :id para el parámetro */}
      </Routes>
    </Router>
  );
}

export default App;
