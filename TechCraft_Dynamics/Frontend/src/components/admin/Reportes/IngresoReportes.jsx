// src/components/ventas/IngresoReportes.jsx
// Importaciones necesarias
import { useNavigate } from 'react-router-dom';
// Css
import '../../../css/admin/ventas/IngresarVentas.css';

export default function IngresoReportes() {
  const navigate = useNavigate();

  return (
    <div className="ingresoventas-contenedor-dashboard">
      <main className="ingresoventas-contenido-principal">
        <div className="ingresoventas-titulo">
          <h1>Reportes</h1>
        </div>

        <div className="ingresoventas-cards">
          {/* Botón de Página Principal de Reportes */}
          <div
            className="ingresoventas-card"
            onClick={() => navigate('/admin/reportes')}
          >
            <span className="material-icons">home</span>
            <h3>Principal</h3>
          </div>

          {/* Botón de Proyección */}
          <div
            className="ingresoventas-card"
            onClick={() => navigate('/admin/reportes/proyeccion')}
          >
            <span className="material-icons">trending_up</span>
            <h3>Proyección</h3>
          </div>


          {/* Botón de Ventas */}
          <div
            className="ingresoventas-card"
            onClick={() => navigate('/admin/reportes/ventas')}
          >
            <span className="material-icons">receipt_long</span>
            <h3>Ventas</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
