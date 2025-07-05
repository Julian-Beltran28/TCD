import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function ListarProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 10;

  useEffect(() => {
    getProveedores();
    // eslint-disable-next-line
  }, [pagina, busqueda]);

  const getProveedores = async () => {
    try {
      const letra = busqueda ? `&letra=${busqueda}` : '';
      const res = await Axios.get(
        `http://localhost:3000/api/proveedores/listar?page=${pagina}&limit=${limite}${letra}`
      );
      // No ordenar aquí, el backend debe devolver ya ordenado por id DESC
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
          setPagina(1); // Siempre vuelve a la página 1 para mostrar los más recientes primero
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
    <div className="container mt-4">
      <h2 className="mb-3">Lista de Proveedores</h2>

      <div className="d-flex mb-3">
        <Link className="btn btn-success me-3" to="/registrar">+ Nuevo Proveedor</Link>
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

      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered text-center align-middle" style={{ tableLayout: "auto", minWidth: 900 }}>
          <thead className="table-dark">
            <tr>
              <th style={{ maxWidth: 180, whiteSpace: "nowrap" }}>Empresa</th>
              <th style={{ maxWidth: 120, whiteSpace: "nowrap" }}>Exportación</th>
              <th style={{ maxWidth: 180, whiteSpace: "nowrap" }}>Representante</th>
              <th style={{ maxWidth: 120, whiteSpace: "nowrap" }}>Contacto</th>
              <th style={{ maxWidth: 200, whiteSpace: "nowrap" }}>Correo</th>
              <th style={{ maxWidth: 80, whiteSpace: "nowrap" }}>Imagen</th>
              <th style={{ maxWidth: 120, whiteSpace: "nowrap" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map(prov => (
                <tr key={prov.id}>
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={prov.nombre_empresa}>
                    {prov.nombre_empresa}
                  </td>
                  <td style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={prov.tipo_exportacion}>
                    {prov.tipo_exportacion}
                  </td>
                  <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={`${prov.nombre_representante} ${prov.apellido_representante}`}>
                    {prov.nombre_representante} {prov.apellido_representante}
                  </td>
                  <td style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={prov.numero_empresarial}>
                    {prov.numero_empresarial}
                  </td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={prov.correo_empresarial}>
                    {prov.correo_empresarial}
                  </td>
                  <td>
                    {prov.imagen_empresa ? (
                      <img
                        loading="lazy"
                        src={`http://localhost:3000/uploads/${prov.imagen_empresa}`}
                        alt="Proveedor"
                        width={60}
                        height={60}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/60';
                        }}
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
              <tr><td colSpan="7">No hay proveedores.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
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
  );
}

export default ListarProveedores;