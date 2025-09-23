// src/pages/CambiarContrasena.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/usuarios/CambiarContrasena.css'; // Estilos nuevos

const CambiarContrasena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmacion) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/usuarios/cambiar-contrasena/${id}`, {
        nuevaContrasena
      });
      setMensaje('Contraseña actualizada correctamente');
      setError('');
      setTimeout(() => navigate('/admin/usuarios'), 2000);
    } catch (error) {
      console.error(error);
      setError('Error al actualizar la contraseña');
    }
  };

return (
  <div className="formUsuario-contenedor-principal d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
    <div className="cambiar-contrasena-card p-4" style={{ width: '100%', maxWidth: '800px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <div className="formUsuario-titulo-box mb-4 text-center">
        <div className="formUsuario-titulo fs-4 fw-bold">Cambiar Contraseña</div>
      </div>
      <div className="formUsuario-formulario-box">
        <form onSubmit={handleSubmit}>
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

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {mensaje && <div className="alert alert-success text-center">{mensaje}</div>}

          <div className="d-flex justify-content-center gap-2 mt-3">
            <button type="submit" className="btn btn-primary">Guardar nueva contraseña</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)};

export default CambiarContrasena;
