import React from "react";
import IngresoReportes from "../../../components/admin/Reportes/IngresoReportes"
import Ventasa from "../../../components/admin/Reportes/Ventas";


const Ventas = () => {
  return (
    <div className='pagina-ventas container py-4'> 
        <IngresoReportes />
        <Ventasa />
    </div>
  );
};

export default Ventas;
