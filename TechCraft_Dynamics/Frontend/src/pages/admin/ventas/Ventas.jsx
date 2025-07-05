import React from 'react';
import IngresoVentas from "../../../components/admin/ventas/Ingreso_ventas";
import ListaProductos from '../../../components/admin/ventas/Lista_Productos';

const Ventas = () => {
  return (
    <div className='pagina-ventas container py-4'> 
      <IngresoVentas />
      <ListaProductos />
    </div>
  );
};

export default Ventas;
