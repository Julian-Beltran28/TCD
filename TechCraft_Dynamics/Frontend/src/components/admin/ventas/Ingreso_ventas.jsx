// src/components/ventas/Ingreso_ventas.jsx
import '../../../css/admin/ventas/IngresarVentas.css';
import { useNavigate } from 'react-router-dom';

function IngresoVentas() {
  const navigate = useNavigate();

  return (
    <div className="contenedor-dashboard">
      <main className="contenido-principal">
        <div className="titulo">
          <h1>Ingresar ventas</h1>
        </div>

        <div className="cards">
          <div className="card" onClick={() => navigate('/admin/ventas')}>
            <span className="material-icons">shopping_cart</span>
            <h3>Punto de ventas</h3>
          </div>

          <div className="card" onClick={() => navigate('/admin/compras')}>
            <span className="material-icons">inventory</span>
            <h3>Compras a proveedores</h3>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IngresoVentas;
