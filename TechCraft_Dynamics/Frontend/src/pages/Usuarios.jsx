import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import '../css/Usuarios/ListarUsuarios.css'; 
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu proyecto

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 10;

  // URL base API
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  // Obtener rol del usuario desde contexto
  const { user } = useAuth();
  const userRole = user?.rol?.toLowerCase() || 'admin';

  const cargarUsuarios = async () => {
    try {
      const letra = busqueda ? `&letra=${busqueda}` : '';
      const res = await axios.get(`${API_URL}/api/usuarios/listar?page=${pagina}&limit=${limite}${letra}`);
      setUsuarios(res.data.usuarios);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      Swal.fire('Error', 'No se pudo cargar la lista de usuarios.', 'error');
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
    if (!usuario) {
      Swal.fire('Error', 'Usuario no encontrado.', 'error');
      return;
    }
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
        await axios.delete(`${API_URL}/api/usuarios/delete/${usuarioId}`);
        Swal.fire('Eliminado', 'El usuario fue desactivado.', 'success');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  return (
    <>
      <div className="usuarios-titulo centrar-titulo mt-4 mb-4">
        <div className="usuarios-titulo-texto">Usuarios</div>
      </div>

      <div className="usuarios-contenedor container">
        <div className="usuarios-barra-busqueda d-flex mb-3">
          {/* Botón solo visible para admin */}
          {userRole === 'admin' && (
            <button
              className="btn-outline-success usuarios-btn-nuevo me-3"
              onClick={() => navigate('/admin/crearUsuario')}
            >
              + Nuevo Usuario
            </button>
          )}

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
                <th>Primer Nombre</th>
                <th>Primer Apellido</th>
                <th>Numero Documento</th>
                <th>Correo Empresarial</th>
                <th>Numero Celular</th>
                {userRole === 'admin' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody className="text-center">
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.Primer_Nombre}</td>
                  <td>{u.Primer_Apellido}</td>
                  <td>{u.Numero_documento || '—'}</td>
                  <td>{u.Correo_empresarial || '—'}</td>
                  <td>{u.Numero_celular || '—'}</td>
                  {userRole === 'admin' && (
                    <td>
                      <div className="usuarios-acciones d-flex flex-wrap justify-content-center gap-1">
                        <button
                          className="btn-outline-warning btn-sm p-2"
                          onClick={() => handleEditar(u.id)}
                          title="Editar usuario"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-outline-danger btn-sm p-2"
                          onClick={() => handleEliminar(u.id)}
                          title="Eliminar usuario"
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="btn-outline-secondary btn-sm p-2"
                          onClick={() => handleCambioContrasena(u.id)}
                          title="Cambiar contraseña"
                        >
                          <FaKey />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="usuarios-paginacion d-flex justify-content-between mt-3">
          <button
            className="btn-outline-primary"
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {pagina} de {Math.max(1, Math.ceil(total / limite))}
          </span>
          <button
            className="btn-outline-primary"
            disabled={pagina === Math.ceil(total / limite) || total === 0}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </>
  );
};

export default Usuarios;
