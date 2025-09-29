import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import '../../css/Proveedores/ListarProveedores.css';
import { useAuth } from '../../context/AuthContext';

function ListarProveedores() {
  const { user } = useAuth();
  const userRole = user?.rol?.toLowerCase();

  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const limite = 10;

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  const getProveedores = async () => {
    try {
      const letra = busqueda ? `&letra=${busqueda}` : '';
      const res = await Axios.get(
        `${API_URL}/api/proveedores/listar?page=${pagina}&limit=${limite}${letra}`
      );
      setProveedores(res.data.proveedores);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      Swal.fire('Error', 'No se pudo cargar la lista de proveedores.', 'error');
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      setCargandoInicial(true);
      await getProveedores();
      setTimeout(() => {
        setCargandoInicial(false);
      }, 1200);
    };
    inicializar();
  }, []);

  useEffect(() => {
    if (!cargandoInicial) {
      getProveedores();
    }
  }, [pagina, busqueda]);

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
          await Axios.put(`${API_URL}/api/proveedores/${id}/soft-delete`);
          setPagina(1);
          getProveedores();
          Swal.fire("Eliminado", "Proveedor eliminado correctamente.", "success");
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar el proveedor.', err);
        }
      }
    });
  };

  const totalPaginas = Math.ceil(total / limite);

  if (cargandoInicial) {
    return (
      <div className="proveedores-loading-screen">
        <div className="proveedores-loading-content">
          <div className="proveedores-loading-spinner">
            <span></span>
          </div>
          <h3 className="proveedores-loading-text">Cargando proveedores...</h3>
          <p className="proveedores-loading-subtext">Espera un momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listarproveedores-contenedor">
      <div className="listarproveedores-centrar-titulo mt-4 mb-4">
        <div className="listarproveedores-tituloP">Proveedores</div>
      </div>

      <div className="listarproveedores-container">
        <div className="listarproveedores-registrar d-flex mb-3">
          {userRole === 'admin' && (
            <Link className="btn-outline btn-outline-primary me-3" to="/admin/proveedores/registrar">
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
                          src={`${API_URL}/uploads/${prov.imagen_empresa}`}
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
                          className="btn-outline btn-outline-success btn-sm me-2"
                        >
                          ✎
                        </Link>
                        <button
                          className="btn-outline btn-outline-danger btn-sm"
                          onClick={() => softDeleteProv(prov.id)}
                        >
                          🗑
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

        <div className="listarproveedores-paginacion d-flex justify-content-between mt-3">
          <button
            className="btn-outline btn-outline-primary"
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            ← Anterior
          </button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button
            className="btn-outline btn-outline-primary"
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