// src/pages/Ventas.jsx
import React from 'react';
import IngresoVentas from '../components/ventas/Ingreso_ventas';
import ListaProductos from '../components/ventas/Lista_Productos';

const Ventas = () => {
  return (
    <div>
      <IngresoVentas />
      <ListaProductos />
    </div>
  );
};

export default Ventas;

