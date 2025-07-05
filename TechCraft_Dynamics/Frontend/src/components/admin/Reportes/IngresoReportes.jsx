// src/components/ventas/IngresoVentas.jsx
import '../../../css/admin/ventas/IngresarVentas.css';
import { useNavigate } from 'react-router-dom';

export default function IngresoReportes() {
  const navigate = useNavigate();

  return (
    <div className="ingresoventas-contenedor-dashboard">
      <main className="ingresoventas-contenido-principal">
        <div className="ingresoventas-titulo">
          <h1>Reportes</h1>
        </div>

        <div className="ingresoventas-cards">
          <div className="ingresoventas-card" onClick={() => navigate('/admin/ventas')}>
            <span className="material-icons">shopping_cart</span>
            <h3>Punto de ventas</h3>
          </div>

            <div className="ingresoventas-card" onClick={() => navigate('/admin/reportes/ventas')}>
            <span className="material-icons">receipt</span>
            <h3>Reportes de ventas</h3>
            </div>

          <div className="ingresoventas-card" onClick={() => navigate('/admin/compras')}>
            <span className="material-icons">inventory</span>
            <h3>Compras a proveedores</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
