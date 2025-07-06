import React from "react";
import IngresoReportes from "../../../components/admin/Reportes/IngresoReportes"
import Proyecciones from "../../../components/admin/Reportes/Proyeciones";


const Reportes = () => {
  return (
    <div className='pagina-ventas container py-4'> 
        <IngresoReportes />
        <Proyecciones />
    </div>
  );
};

export default Reportes;
