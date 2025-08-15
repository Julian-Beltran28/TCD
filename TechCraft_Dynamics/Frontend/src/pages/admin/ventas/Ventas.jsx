import React from 'react';
import ListaProductos from '../../../components/admin/ventas/Lista_Productos';
import IngresoVentas from "../../../components/admin/ventas/Ingreso_ventas";

const Ventas = () => {
  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoVentas />
      <ListaProductos />
    </div>
  );
};

export default Ventas;
