import React, { useState, useEffect } from "react";
import IngresoReportes from "../../../components/admin/Reportes/IngresoReportes"
import PanelPrincipal from "../../../components/admin/Reportes/PanelPrincipal";
import '../../../css/admin/Reportes/Reportes.css';

const Reportes = () => {
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCargandoInicial(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (cargandoInicial) {
    return (
      <div className="reportes-loading-screen">
        <div className="reportes-loading-content">
          <div className="reportes-loading-spinner">
            <span></span>
          </div>
          <h3 className="reportes-loading-text">Cargando reportes...</h3>
          <p className="reportes-loading-subtext">Espera un momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoReportes />
      <PanelPrincipal />
    </div>
  );
};

export default Reportes;