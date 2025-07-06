// src/pages/admin/Proveedores/Proveedores.jsx
import React from 'react';
import ListarProveedores from '../../../components/Proveedores/ListarProveedores';

export default function Proveedores() {
  return (
    <div className="card p-3 shadow-sm">
      <ListarProveedores />
    </div>
  );
}