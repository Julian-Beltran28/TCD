import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../css/Usuarios/FormularioUsuario.css'; // Nuevo CSS exclusivo

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
    setTimeout(() => {
      navigate('/admin/usuarios');
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const camposVacios = Object.entries(formData).some(([key, val]) =>
      ['Primer_Nombre', 'Primer_Apellido', 'Correo_personal', 'id_Rol'].includes(key) && val.trim() === ''
    );

    if (camposVacios) {
      return Swal.fire('Campos requeridos', 'Por favor llena todos los campos obligatorios', 'warning');
    }

    try {
      const res = await axios.post('http://localhost:3000/api/usuarios', formData);
      Swal.fire('Registrado', `Usuario creado con contraseña: ${res.data.contrasena}`, 'success');
      navigate('/admin/usuarios');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Error al registrar usuario', 'error');
    }
  };

  return (
    <div className="formUsuario-contenedor-principal">
      <div className="container mt-4">
        <div className="formUsuario-titulo-box mb-4">
          <div className="formUsuario-titulo">Registrar Usuario</div>
        </div>
        <div className="formUsuario-formulario-box">
         <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input type="text" name="Primer_Nombre" placeholder="Primer Nombre *" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" name="Segundo_Nombre" placeholder="Segundo Nombre" className="form-control" onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-2">
              <input type="text" name="Primer_Apellido" placeholder="Primer Apellido *" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" name="Segundo_Apellido" placeholder="Segundo Apellido" className="form-control" onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-2">
              <input type="text" name="Tipo_documento" placeholder="Tipo de Documento" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" name="Numero_documento" placeholder="Número de Documento" className="form-control" onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-2">
              <input type="text" name="Numero_celular" placeholder="Número Celular" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-2">
              <input type="email" name="Correo_personal" placeholder="Correo Personal *" className="form-control" onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-2">
              <input type="email" name="Correo_empresarial" placeholder="Correo Empresarial" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <input type="number" name="id_Rol" placeholder="ID del Rol *" className="form-control" onChange={handleChange} />
            </div>
          </div>

          <div className="formUsuario-botones text-center">
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
