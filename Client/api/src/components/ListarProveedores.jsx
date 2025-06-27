import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


// Trae los proveedores de la DB y hace la busqueda.
function ListarProveedores() {
  const [proveedoresLista, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getProveedores();
  }, []);


// Conexión con el navegador.
  const getProveedores = () => {
    Axios.get("http://localhost:5000/proveedores")
      .then((res) => {
        setProveedores(res.data);
      })
      .catch(err => Swal.fire('Error al consultar proveedores', err.message, 'error'));
  };


  // Mensaje al borrar un proveedor.
  const deleteProv = (id) => {
    Swal.fire({
      title: "¿Estás segur@ de eliminar al proveedor?",
      text: "¡No podrás deshacer esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:5000/delete/${id}`)
          .then(() => {
            getProveedores();
            Swal.fire("Eliminado", "Proveedor eliminado correctamente.", "success");
          })
          .catch(err => Swal.fire('Error al eliminar', err.message, 'error'));
      }
    });
  };


// Busqueda y comparacion en los proveedores.
  const proveedoresFiltrados = proveedoresLista.filter((prov) =>
    prov.nombre_empresa.toLowerCase().includes(busqueda.toLowerCase())
  );


// Botón para agregar un nuevo proveedor y tabla con los proveedores
  return (
    <div className="container-fluid mt-3">
      <div className="d-flex align-items-center mb-3">
        <div className='registrar'>
          <i className="fa-solid fa-user fa-lg"></i>
          <Link to="/registrar" className="btn btn-success btn-sm ms-2">
            Agregar proveedor nuevo
          </Link>
        </div>
        <div className="ms-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>
      <div className='contenedor-tabla'>
        <div className="table-responsive-custom">
          <table className="table table-bordered table-hover align-middle text-center table-striped">
            <thead className='table-dark'>
              <tr>
                <th>Nombre Empresa</th>
                <th>Tipo Exportación</th>
                <th>Nombre Representante</th>
                <th>Apellido Representante</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Imagen</th>
                <th>Editar Proveedor</th>
                <th>Eliminar Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.nombre_empresa}</td>
                  <td>{prov.tipo_exportacion}</td>
                  <td>{prov.nombre_representante}</td>
                  <td>{prov.apellido_representante}</td>
                  <td>{prov.numero_empresarial}</td>
                  <td>{prov.correo_empresarial}</td>
                  <td>
                    <img
                      src={`http://localhost:5000/uploads/${prov.imagen_empresa}`}
                      alt="Logo"
                      width="60"
                      height="60"
                      style={{ objectFit: 'cover', borderRadius: '5px' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </td>
                  <td>
                    <Link to={`/actualizar/${prov.id}`} className="btn btn-success btn-sm me-2 ">Actualizar</Link>
                  </td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => deleteProv(prov.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListarProveedores;