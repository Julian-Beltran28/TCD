import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import '../css/Usuarios/ListarUsuarios.css'; 

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 10;

  const cargarUsuarios = async () => {
    try {
      const letra = busqueda ? `&letra=${busqueda}` : '';
      const res = await axios.get(`http://localhost:3000/api/usuarios/listar?page=${pagina}&limit=${limite}${letra}`);
      setUsuarios(res.data.usuarios);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [pagina, busqueda]);

  const handleEditar = (usuarioId) => {
    navigate(`/admin/editarUsuario/${usuarioId}`);
  };

  const handleCambioContrasena = (usuarioId) => {
    navigate(`/admin/cambiarContrasena/${usuarioId}`);
  };

  const handleEliminar = async (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    const nombreCompleto = `${usuario.Primer_Nombre} ${usuario.Primer_Apellido}`;

    const confirmacion = await Swal.fire({
      title: `¿Eliminar a ${nombreCompleto}?`,
      text: 'Esta acción desactivará el usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/usuarios/delete/${usuarioId}`);
        Swal.fire('Eliminado', 'El usuario fue desactivado.', 'success');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  return (
    <div className="usuarios-contenedor container">

      <div className="usuarios-titulo centrar-titulo mt-4 mb-4">
        <div className="usuarios-titulo-texto">Editar Usuario</div>
      </div>

      <div className="usuarios-barra-busqueda d-flex mb-3">
        <button className="usuarios-btn-nuevo btn btn-success me-3" onClick={() => navigate('/admin/crearUsuario')}>
          + Nuevo Usuario
        </button>
        <input
          type="text"
          className="usuarios-input-busqueda form-control w-auto"
          maxLength={1}
          placeholder="Buscar por letra..."
          value={busqueda}
          onChange={e => {
            const letra = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1);
            setBusqueda(letra);
            setPagina(1);
          }}
        />
      </div>

      <div className="usuarios-tabla table-responsive-custom">
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>ID</th>
              <th>Primer Nombre</th>
              <th>Primer Apellido</th>
              <th>Numero Documento</th>
              <th>Correo Empresarial</th>
              <th>Numero Celular</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.Primer_Nombre}</td>
                <td>{u.Primer_Apellido}</td>
                <td>{u.Numero_documento || '—'}</td>
                <td>{u.Correo_empresarial || '—'}</td>
                <td>{u.Numero_celular || '—'}</td>
                <td>{u.id_Rol}</td>
                <td>
                  <div className="usuarios-acciones d-flex flex-wrap justify-content-center gap-1">
                    <button className="btn btn-warning btn-sm p-2" onClick={() => handleEditar(u.id)}><FaEdit /></button>
                    <button className="btn btn-danger btn-sm p-2" onClick={() => handleEliminar(u.id)}><FaTrash /></button>
                    <button className="btn btn-secondary btn-sm p-2" onClick={() => handleCambioContrasena(u.id)}><FaKey /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="usuarios-paginacion d-flex justify-content-between mt-3">
        <button
          className="btn btn-outline-primary"
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
        >
          ← Anterior
        </button>
        <span>Página {pagina} de {Math.ceil(total / limite)}</span>
        <button
          className="btn btn-outline-primary"
          disabled={pagina === Math.ceil(total / limite)}
          onClick={() => setPagina(pagina + 1)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default Usuarios;
