// src/pages/Compras.jsx
import React from 'react';
import IngresoVentas from '../components/ventas/Ingreso_ventas';
import ProveedorCompras from '../components/ventas/ProveedorCompras';

const Compras = () => {
  return (
    <div>
      <IngresoVentas />
      <ProveedorCompras />
    </div>
  );
};

export default Compras;
