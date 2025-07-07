// src/components/Perfil.jsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import './Perfil.css';

function PerfilUsuario({ userId }) {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  useEffect(() => {
    if (!userId) return;
    Axios.get(`http://localhost:3000/api/perfil/${userId}`)
      .then((res) => {
        setPerfil(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const guardarCambios = async () => {
    try {
      const confirm = await Swal.fire({
        title: '¿Guardar cambios?',
        text: 'Se actualizará la información del perfil.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
      });

      if (!confirm.isConfirmed) return;

      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (imagenFile) {
        data.append('imagen', imagenFile);
      }

      await Axios.put(`http://localhost:3000/api/perfil/${userId}`, data);

      Swal.fire('Guardado', 'Perfil actualizado correctamente', 'success');
      setEditando(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  const cancelarEdicion = () => {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Se descartarán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(perfil); // Restaurar valores
        setEditando(false);
        setImagenPreview(null);
        setImagenFile(null);
        Swal.fire('Cancelado', 'Cambios descartados', 'info');
      }
    });
  };

  const iniciarEdicion = () => {
    Swal.fire({
      title: 'Modo edición',
      text: 'Ahora puedes modificar los datos del perfil.',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
    });
    setEditando(true);
  };

  if (!perfil) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="containerPrincipal">
      <div className="contenedorPerfil">
        <h2 className="tituloPerfil">Perfil del Usuario</h2>

        <div className="contenidoPerfil">
          <div className="imagenPerfil">
            <img
              src={
                imagenPreview
                  ? imagenPreview
                  : perfil.imagen
                  ? `http://localhost:3000/uploads/${perfil.imagen}`
                  : 'https://via.placeholder.com/150'
              }
              alt="Perfil"
              className="imgRedonda"
            />
          </div>

          <div className="Formulario">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Primer Nombre" name="Primer_Nombre" value={formData.Primer_Nombre} onChange={handleChange} disabled={!editando} />
              <Input label="Segundo Nombre" name="Segundo_Nombre" value={formData.Segundo_Nombre} onChange={handleChange} disabled={!editando} />
              <Input label="Primer Apellido" name="Primer_Apellido" value={formData.Primer_Apellido} onChange={handleChange} disabled={!editando} />
              <Input label="Segundo Apellido" name="Segundo_Apellido" value={formData.Segundo_Apellido} onChange={handleChange} disabled={!editando} />
              <Input label="Tipo Documento" name="Tipo_documento" value={formData.Tipo_documento} onChange={handleChange} disabled={!editando} />
              <Input label="Número Documento" name="Numero_documento" value={formData.Numero_documento} onChange={handleChange} disabled={!editando} />
              <Input label="Número Celular" name="Numero_celular" value={formData.Numero_celular} onChange={handleChange} disabled={!editando} />
              <Input label="Correo Personal" name="Correo_personal" value={formData.Correo_personal} onChange={handleChange} disabled={!editando} />
              <Input label="Correo Empresarial" name="Correo_empresarial" value={formData.Correo_empresarial} onChange={handleChange} disabled={!editando} />
              <Input label="Rol" value={formData.Rol} disabled />
            </div>

            {editando && (
              <div className="mt-4">
                <label className="block font-medium mb-1">Cambiar Imagen:</label>
                <input type="file" accept="image/*" onChange={handleImagenChange} />
              </div>
            )}

            <div className="botonesPerfil">
              {editando ? (
                <>
                  <button onClick={guardarCambios} className="btnGuardar">
                    Guardar Cambios
                  </button>
                  <button onClick={cancelarEdicion} className="btnCancelar">
                    Cancelar
                  </button>
                </>
              ) : (
                <button onClick={iniciarEdicion} className="btnEditar">
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, disabled }) {
  return (
    <div className="campoInput">
      <label className="labelInput">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className={`inputPerfil ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      />
    </div>
  );
}

export default PerfilUsuario;
