// src/components/Perfil.jsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';

function PerfilUsuario({ userId }) {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);

  useEffect(() => {
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
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (imagenFile) {
        data.append('imagen', imagenFile);
      }

      await Axios.put(`http://localhost:3000/api/perfil/${userId}`, data);
      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
      setEditando(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  if (!perfil) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Perfil del Usuario</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex justify-center">
          <img
            src={
              imagenPreview
                ? imagenPreview
                : perfil.imagen
                ? `http://localhost:3000/uploads/${perfil.imagen}`
                : 'https://via.placeholder.com/150'
            }
            alt="Perfil"
            className="w-40 h-40 object-cover rounded-full border"
          />
        </div>

        <div className="md:w-2/3">
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

          <div className="flex justify-end mt-6 gap-4">
            {editando ? (
              <>
                <button onClick={guardarCambios} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Guardar Cambios
                </button>
                <button onClick={() => setEditando(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={() => setEditando(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 border rounded ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      />
    </div>
  );
}

export default PerfilUsuario;
