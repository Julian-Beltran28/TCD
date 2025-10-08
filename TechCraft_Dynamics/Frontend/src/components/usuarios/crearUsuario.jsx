// Importaciones necesarias
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// Css
import '../../css/usuarios/FormularioUsuario.css';

function CrearUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelar = () => {
    Swal.fire({
      title: 'Cancelado',
      text: 'Registro cancelado.',
      icon: 'info',
      timer: 1200,
      showConfirmButton: false
    });
    setTimeout(() => navigate('/admin/usuarios'), 1200);
  };

  const handleSubmit = async (e) => {
    // Peticion para los campos sean obligatorios 
    e.preventDefault();
    const camposVacios = ['Primer_Nombre', 'Primer_Apellido', 'Correo_personal', 'id_Rol']
      .some(campo => !formData[campo].trim());

    // Alerta de los campos vacios
    if (camposVacios) {
      return Swal.fire('Campos requeridos', 'Por favor completa todos los campos obligatorios', 'warning');
    }

    try {
      // SIEMPRE usar Railway para consistencia
      const res = await axios.post('https://tcd-production.up.railway.app/api/usuarios', formData);
      Swal.fire('Registrado', `Usuario creado con contraseña: ${res.data.contrasena}`, 'success');
      navigate('/admin/usuarios');
    } catch (error) {
      console.error('Error completo:', error);
      Swal.fire('Error', error.response?.data?.error || 'Error al registrar usuario', 'error');
    }
  };

  return (
    <div className="formUsuario-contenedor-principal">
      <div className="container mt-4">
        <h2 className="Usuario-titulo text-center mb-4">Registrar Usuario</h2>
        
        <div className="Usuario-formulario-box">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Primer Nombre */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Primer_Nombre" placeholder="Primer Nombre *" className="form-control" onChange={handleChange} />
              </div>
              {/* Segundo Nombre */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Segundo_Nombre" placeholder="Segundo Nombre" className="form-control" onChange={handleChange} />
              </div>
              {/* Primer Apellido */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Primer_Apellido" placeholder="Primer Apellido *" className="form-control" onChange={handleChange} />
              </div>
              {/* Segundo Apellido */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Segundo_Apellido" placeholder="Segundo Apellido" className="form-control" onChange={handleChange} />
              </div>
              {/* Tipo Documento */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Tipo_documento" placeholder="Tipo de Documento" className="form-control" onChange={handleChange} />
              </div>
              {/* Numero de Documento */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Numero_documento" placeholder="Número de Documento" className="form-control" onChange={handleChange} />
              </div>
              {/* Numero Celular */}
              <div className="col-md-6 mb-3">
                <input type="text" name="Numero_celular" placeholder="Número Celular" className="form-control" onChange={handleChange} />
              </div>
              {/* Correo Personal */}
              <div className="col-md-6 mb-3">
                <input type="email" name="Correo_personal" placeholder="Correo Personal *" className="form-control" onChange={handleChange} />
              </div>
              {/* Correo Empresarial */}
              <div className="col-md-6 mb-3">
                <input type="email" name="Correo_empresarial" placeholder="Correo Empresarial" className="form-control" onChange={handleChange} />
              </div>
              {/* Rol */}
              <div className="col-md-6 mb-3">
                <input type="number" name="id_Rol" placeholder="ID del Rol *" className="form-control" onChange={handleChange} />
              </div>
            </div>
            {/* Botones */}
            <div className="text-center">
              <button type="submit" className="btn btn-success m-2">Registrar</button>
              <button type="button" className="btn btn-secondary m-2" onClick={handleCancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearUsuario;
