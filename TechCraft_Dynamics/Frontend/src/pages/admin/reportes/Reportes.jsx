import React from "react";
import IngresoReportes from "../../../components/admin/Reportes/IngresoReportes"
import ComprasProveedor from "../../../components/admin/Reportes/VentasProveedor";
import ReportesVenta from "../../../components/admin/Reportes/ListaVentas";


const Reportes = () => {
  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoReportes />
      <ReportesVenta />
      <ComprasProveedor />
    </div>
  );
};

export default Reportes;
