import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Usuarios/ListarUsuarios.css'; // Reutilizamos estilos visuales de usuarios

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/usuarios/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/usuarios/${id}`, usuario);
      navigate('/admin/usuarios');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  return (
    <div className="Usuario-contenedor-principal">      
        <div className="Usuario-titulo">Editar Usuario</div>
      <div className="Usuario-formulario-box">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input type="text" name="Primer_Nombre" placeholder="Primer Nombre *" className="form-control" value={usuario.Primer_Nombre} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-2">
            <input type="text" name="Segundo_Nombre" placeholder="Segundo Nombre" className="form-control" value={usuario.Segundo_Nombre} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-2">
            <input type="text" name="Primer_Apellido" placeholder="Primer Apellido *" className="form-control" value={usuario.Primer_Apellido} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-2">
            <input type="text" name="Segundo_Apellido" placeholder="Segundo Apellido" className="form-control" value={usuario.Segundo_Apellido} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-2">
            <input type="text" name="Tipo_documento" placeholder="Tipo de Documento" className="form-control" value={usuario.Tipo_documento} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <input type="text" name="Numero_documento" placeholder="Número de Documento" className="form-control" value={usuario.Numero_documento} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-2">
            <input type="text" name="Numero_celular" placeholder="Número Celular" className="form-control" value={usuario.Numero_celular} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-2">
            <input type="email" name="Correo_personal" placeholder="Correo Personal" className="form-control" value={usuario.Correo_personal} onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-2">
            <input type="email" name="Correo_empresarial" placeholder="Correo Empresarial" className="form-control" value={usuario.Correo_empresarial} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <input type="text" name="id_Rol" placeholder="ID del Rol *" className="form-control" value={usuario.id_Rol} onChange={handleChange} required />
          </div>
        </div>

        <div className="formUsuario-botones text-center">
          <button type="submit" className="btn btn-success m-2">Guardar</button>
            <button type="button" className="btn btn-secondary m-2" onClick={() => navigate('/admin/usuarios')}>Cancelar</button>
        </div>
      </form>
      </div>
      </div>
  );
};

export default EditarUsuario;
