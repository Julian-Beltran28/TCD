import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import '../../css/Proveedores/ListarProveedores.css';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta a tu AuthContext

function ListarProveedores() {
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const userRole = user?.rol?.toLowerCase(); // 'admin', 'supervisor', 'personal', etc.

  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 10;

  useEffect(() => {
    getProveedores();
  }, [pagina, busqueda]);

  const getProveedores = async () => {
    try {
      const letra = busqueda ? `&letra=${busqueda}` : '';
      const res = await Axios.get(
        `http://localhost:3000/api/proveedores/listar?page=${pagina}&limit=${limite}${letra}`
      );
      setProveedores(res.data.proveedores);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      Swal.fire('Error', 'No se pudo cargar la lista de proveedores.', 'error');
    }
  };

  const softDeleteProv = (id) => {
    Swal.fire({
      title: "¿Estás segur@ de eliminar al proveedor?",
      text: "¡No podrás deshacer esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.put(`http://localhost:3000/api/proveedores/${id}/soft-delete`);
          setPagina(1);
          getProveedores();
          Swal.fire("Eliminado", "Proveedor eliminado correctamente.", "success");
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar el proveedor.', 'error');
        }
      }
    });
  };

  const totalPaginas = Math.ceil(total / limite);

  return (
    <div className="listarproveedores-contenedor">
      {/* TÍTULO */}
      <div className="listarproveedores-centrar-titulo mt-4 mb-4">
        <div className="listarproveedores-tituloP">Proveedores</div>
      </div>

      <div className="listarproveedores-container">
        {/* BOTÓN + BUSCADOR */}
        <div className="listarproveedores-registrar d-flex mb-3">
          {userRole === 'admin' && (
            <Link className="btn btn-success me-3" to="/admin/proveedores/registrar">
              + Nuevo Proveedor
            </Link>
          )}
          <input
            type="text"
            className="form-control w-auto"
            maxLength={1}
            style={{ width: 120 }}
            placeholder="Buscar por letra..."
            value={busqueda}
            onChange={e => {
              const letra = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1);
              setBusqueda(letra);
              setPagina(1);
            }}
          />
        </div>

        {/* TABLA */}
        <div className="listarproveedores-table-responsive-custom">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Empresa</th>
                <th>Representante</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Imagen</th>
                {userRole === 'admin' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {proveedores.length > 0 ? (
                proveedores.map(prov => (
                  <tr key={prov.id}>
                    <td title={prov.nombre_empresa}>{prov.nombre_empresa}</td>
                    <td title={`${prov.nombre_representante} ${prov.apellido_representante}`}>
                      {prov.nombre_representante} {prov.apellido_representante}
                    </td>
                    <td title={prov.numero_empresarial}>{prov.numero_empresarial}</td>
                    <td title={prov.correo_empresarial}>{prov.correo_empresarial}</td>
                    <td>
                      {prov.imagen_empresa ? (
                        <img
                          loading="lazy"
                          src={`http://localhost:3000/uploads/${prov.imagen_empresa}`}
                          alt="Proveedor"
                          width={60}
                          height={60}
                          style={{ objectFit: "cover", borderRadius: 6 }}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60'; }}
                        />
                      ) : (
                        <span>No imagen</span>
                      )}
                    </td>
                    {userRole === 'admin' && (
                      <td>
                        <Link
                          to={`/admin/proveedores/actualizar/${prov.id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          <box-icon name='edit'></box-icon>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => softDeleteProv(prov.id)}
                        >
                          <box-icon name='trash'></box-icon>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={userRole === 'admin' ? "6" : "5"}>No hay proveedores.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="listarproveedores-paginacion d-flex justify-content-between mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            ← Anterior
          </button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button
            className="btn btn-outline-primary"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListarProveedores;
