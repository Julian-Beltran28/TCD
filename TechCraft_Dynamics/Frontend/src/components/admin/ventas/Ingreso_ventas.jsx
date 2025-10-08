// src/components/ventas/IngresoVentas.jsx
// Importaciones necesarias
import { useNavigate } from 'react-router-dom';
// Css
import '../../../css/admin/ventas/IngresarVentas.css';

export default function IngresoVentas() {
  const navigate = useNavigate();

  return (
    // Card del ingreso de ventas
    <div className="ingresoventas-contenedor-dashboard">
      <main className="ingresoventas-contenido-principal">
        {/* Parte de ingreso de ventas */}
        <div className="ingresoventas-titulo">
          <h1>Ingresar ventas</h1> 
        </div>

        <div className="ingresoventas-cards">
          <div className="ingresoventas-card" onClick={() => navigate('/admin/ventas')}>
            {/* Titulo de ventas */}
            <span className="material-icons">shopping_cart</span>
            <h3>Punto de ventas</h3>
          </div>

          <div className="ingresoventas-card" onClick={() => navigate('/admin/compras')}>
            {/* Parte de compra de proveedores */}
            <span className="material-icons">inventory</span>
            <h3>Compras a proveedores</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
