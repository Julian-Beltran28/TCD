import React, { useState, useEffect } from 'react';
import ListaProductos from '../../../components/admin/ventas/Lista_Productos';
import IngresoVentas from "../../../components/admin/ventas/Ingreso_ventas";
import "../../../css/admin/ventas/ventas.css";

const Ventas = () => {
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setCargandoInicial(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (cargandoInicial) {
    return (
      <div className="ventas-loading-screen">
        <div className="ventas-loading-content">
          <div className="ventas-loading-spinner">
            <span></span>
          </div>
          <h3 className="ventas-loading-text">Cargando ventas...</h3>
          <p className="ventas-loading-subtext">Espera un momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoVentas />
      <ListaProductos />
    </div>
  );
};

export default Ventas;