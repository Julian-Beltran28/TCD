import React from "react";
import IngresoReportes from "../../../components/admin/Reportes/IngresoReportes"
import PanelPrincipal from "../../../components/admin/Reportes/PanelPrincipal";


const Reportes = () => {
  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoReportes />
      <PanelPrincipal />
      
    </div>
  );
};

export default Reportes;
