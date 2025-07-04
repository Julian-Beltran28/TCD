import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function ListarProveedores() {
  const [proveedoresLista, setProveedores] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3000/api/proveedores/listar")
      .then(res => setProveedores(res.data))
      .catch(err => Swal.fire('Error', err.message, 'error'));
  }, []);

  return (
    <div className="container mt-3">
      <h2>Lista de Proveedores</h2>
      <Link className="btn btn-success mb-2" to="/registrar">Nuevo Proveedor</Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Exportación</th>
            <th>Representante</th>
            <th>Contacto</th>
            <th>Correo</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresLista.map(prov => (
            <tr key={prov.id}>
              <td>{prov.nombre_empresa}</td>
              <td>{prov.tipo_exportacion}</td>
              <td>{prov.nombre_representante} {prov.apellido_representante}</td>
              <td>{prov.numero_empresarial}</td>
              <td>{prov.correo_empresarial}</td>
              <td><img src={`http://localhost:3000/uploads/${prov.imagen_empresa}`} width={60} height={60} /></td>
              <td>
                <Link to={`/actualizar/${prov.id}`} className="btn btn-warning btn-sm">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarProveedores;
