import React from "react";
import ProveedorCompras from "../../../components/admin/ventas/ProveedorCompras";
import IngresoVentas from "../../../components/admin/ventas/Ingreso_ventas";

const Compras = () => {
  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoVentas />
      <ProveedorCompras />
    </div>
  );
};

export default Compras;
