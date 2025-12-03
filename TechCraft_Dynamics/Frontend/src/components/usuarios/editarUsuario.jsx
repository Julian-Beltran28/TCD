// Importaciones necesarios
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// Css
import '../../css/usuarios/ListarUsuarios.css'; // Reutilizamos estilos visuales de usuarios

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  const [usuario, setUsuario] = useState({
    Primer_Nombre: '',
    Segundo_Nombre: '',
    Primer_Apellido: '',
    Segundo_Apellido: '',
    Tipo_documento: '',
    Numero_documento: '',
    Numero_celular: '',
    Correo_personal: '',
    Correo_empresarial: '',
    id_Rol: ''
  });

  // Muestra al usuarios seleccionado previamente 
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/usuarios/${id}`);
        setUsuario(res.data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    };
    cargarUsuario();
  }, [id]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // Guarda los Datos del usuario seleccionado
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`${API_URL}/api/usuarios/${id}`, usuario);
      Swal.fire('Guardado', 'Usuario modificado exitosamente', 'success')
      navigate('/admin/usuarios');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      Swal.fire('Error', error.response?.data.error || 'Error al modificar al usuarios')
    } finally {
      setIsSubmitting(false);
    }
  };

  // funcion para la alerta de cancelar
      const handleCancelar = (e) => {
                          e.preventDefault();
                          Swal.fire({
                          title: 'Cancelado.',
                          text: 'El proceso se canceló con éxito.',
                          icon: 'warning',
                          showConfirmButton: false,
                          timer: 1000,
                          timerProgressBar: true,
                          }).then(() => {
                          navigate(-1);
                          });
                      };

  return (
    <div className="Usuario-contenedor-principal">      
        <div className="Usuario-titulo">Editar Usuario</div>
        
      <div className="Usuario-formulario-box">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Primer Nombre */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Primer_Nombre" placeholder="Primer Nombre *" className="form-control" value={usuario.Primer_Nombre} onChange={handleChange} required />
            </div>
            {/* Segundo Nombre */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Segundo_Nombre" placeholder="Segundo Nombre" className="form-control" value={usuario.Segundo_Nombre} onChange={handleChange} />
            </div>
            {/* Primer apellido */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Primer_Apellido" placeholder="Primer Apellido *" className="form-control" value={usuario.Primer_Apellido} onChange={handleChange} required />
            </div>
            {/* Segundo apellido */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Segundo_Apellido" placeholder="Segundo Apellido" className="form-control" value={usuario.Segundo_Apellido} onChange={handleChange} />
            </div>
            {/* Tipo Documento */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Tipo_documento" placeholder="Tipo de Documento" className="form-control" value={usuario.Tipo_documento} onChange={handleChange} />
            </div>
            {/* Numero Documento */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Numero_documento" placeholder="Número de Documento" className="form-control" value={usuario.Numero_documento} onChange={handleChange} />
            </div>
            {/* Numero Celular */}
            <div className="col-md-6 mb-2">
              <input type="text" name="Numero_celular" placeholder="Número Celular" className="form-control" value={usuario.Numero_celular} onChange={handleChange} />
            </div>
            {/* Correo Personal */}
            <div className="col-md-6 mb-2">
              <input type="email" name="Correo_personal" placeholder="Correo Personal" className="form-control" value={usuario.Correo_personal} onChange={handleChange} required />
            </div>
            {/* Correo Empresarial */}
            <div className="col-md-6 mb-2">
              <input type="email" name="Correo_empresarial" placeholder="Correo Empresarial" className="form-control" value={usuario.Correo_empresarial} onChange={handleChange} />
            </div>
            {/* Rol de usuario */}
            <div className="col-md-6 mb-3">
              <input type="text" name="id_Rol" placeholder="ID del Rol *" className="form-control" value={usuario.id_Rol} onChange={handleChange} required />
            </div>
          </div>
          {/* Botones  */}
          <div className="formUsuario-botones text-center">
            <button type="submit" className="btn btn-success m-2" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
              <button type="button" className="btn btn-secondary m-2" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
      </div>
  );
};

export default EditarUsuario;
