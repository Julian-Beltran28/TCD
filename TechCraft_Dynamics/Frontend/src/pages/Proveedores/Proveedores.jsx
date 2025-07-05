import React from 'react';
import { Link } from 'react-router-dom';
import ListarProveedores from '../../components/Proveedores/ListarProveedores';

export default function Proveedores() {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Gestión de Proveedores</h2>
        <Link to="/registrar" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i> Nuevo Proveedor
        </Link>
      </div>

      <div className="card p-3 shadow-sm">
        <ListarProveedores />
      </div>
    </div>
  );
}