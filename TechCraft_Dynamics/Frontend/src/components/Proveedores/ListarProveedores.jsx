import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function ListarProveedores() {
  const [proveedoresLista, setProveedores] = useState([]);

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = () => {
    Axios.get("http://localhost:3000/api/proveedores/listar") // Asegúrate que este puerto es el correcto
      .then(res => setProveedores(res.data))
      .catch(err => {
        console.error("Error al obtener proveedores:", err);
        Swal.fire('Error', 'No se pudo cargar la lista de proveedores.', 'error');
      });
  };

  const softDeleteProv = (id) => {
    Swal.fire({
      title: "¿Estás segur@ de eliminar al proveedor?",
      text: "¡No podrás deshacer esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.put(`http://localhost:3000/api/proveedores/${id}/soft-delete`)
          .then(() => {
            getProveedores();
            Swal.fire("Eliminado", "Proveedor eliminado correctamente.", "success");
          })
          .catch(err => {
            console.error("Error al eliminar proveedor:", err);
            Swal.fire('Error al eliminar', 'No se pudo eliminar el proveedor.', 'error');
          });
      }
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Lista de Proveedores</h2>
      <Link className="btn btn-success mb-3" to="/registrar">+ Nuevo Proveedor</Link>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
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
          {proveedoresLista.length > 0 ? (
            proveedoresLista.map(prov => (
              <tr key={prov.id}>
                <td>{prov.nombre_empresa}</td>
                <td>{prov.tipo_exportacion}</td>
                <td>{prov.nombre_representante} {prov.apellido_representante}</td>
                <td>{prov.numero_empresarial}</td>
                <td>{prov.correo_empresarial}</td>
                <td>
                  {prov.imagen_empresa ? (
                    <img
                      src={`http://localhost:3000/uploads/${prov.imagen_empresa}`}
                      alt="Proveedor"
                      width={60}
                      height={60}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60'; }}
                    />
                  ) : (
                    <span>No imagen</span>
                  )}
                </td>
                <td>
                  <Link to={`/actualizar/${prov.id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => softDeleteProv(prov.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay proveedores registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListarProveedores;
