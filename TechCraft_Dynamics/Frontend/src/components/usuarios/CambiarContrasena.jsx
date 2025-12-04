// src/pages/CambiarContrasena.jsx
// Importaciones necesarias
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// Css
import '../../css/usuarios/CambiarContrasena.css'; // Estilos nuevos

const CambiarContrasena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const API_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : 'https://tcd-production.up.railway.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verificacion de contraseñas - Ambas tienen que ser iguales
    if (nuevaContrasena !== confirmacion) {
      setError('Las contraseñas no coinciden');
      return;
    }
    // Hace el cambio de contraseña en la Base de Datos
    try {
      await axios.put(`${API_URL}/api/usuarios/cambiar-contrasena/${id}`, {
        nuevaContrasena
      });
      Swal.fire('Registrado', 'Cambio de contraseña exitosamente', 'success');
      setError('');
      setTimeout(() => navigate('/admin/usuarios'), 2000);
    } catch (error) {
      console.error(error);
      setError('Error al actualizar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
      Swal.fire({
        title: 'Cancelado',
        text: 'Cambio de contraseña cancelada.',
        icon: 'info',
        timer: 1200,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/admin/usuarios'), 1200);
    };

return (
  <div className="formUsuario-contenedor-principal d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
    <div className="cambiar-contrasena-card p-4" style={{ width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      {/* Formulario de cambio de contraseña */}
      <div className="formUsuario-titulo-box mb-4 text-center">
        <div className="fs-4 fw-bold">Cambiar Contraseña</div>
      </div>
      <div className="">
        <form onSubmit={handleSubmit}>
          {/* Input de contraseña Nueva */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Nueva Contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {/* Input de confirmacion de contraseña */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmar Contraseña"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              required
            />
          </div>
          {/* Mensajes de error al no poder cambiar la contraseña */}
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Guardando contraseña nueva' : 'Guardar contraseña nueva'}</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)};

export default CambiarContrasena;
