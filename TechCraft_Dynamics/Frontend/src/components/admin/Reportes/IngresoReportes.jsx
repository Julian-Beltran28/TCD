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
          {/* Botón de Proyección */}
          <div className="ingresoventas-card" onClick={() => navigate('/admin/reportes/proyeccion')}>
            <span className="material-icons">trending_up</span>
            <h3>Proyección</h3>
          </div>

          {/* Botón de Estadísticas */}
          <div className="ingresoventas-card" onClick={() => navigate('/admin/reportes/estadisticas')}>
            <span className="material-icons">bar_chart</span>
            <h3>Estadísticas</h3>
          </div>

          {/* Botón de Ventas */}
          <div className="ingresoventas-card" onClick={() => navigate('/admin/reportes/ventas')}>
            <span className="material-icons">receipt_long</span>
            <h3>Ventas</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
