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

  // Cambio de contraseña para el usuario nuevo
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

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

  const handleChangePassword = async (e) =>{
    e.preventDefault();
    try {

      // Validacion por la parte del frontend
      if(!passwordActual || !passwordNueva || !confirmarPassword){
        Swal.fire("Error", "Todos los campos son obligatorios", "error");
        return;
      }

      // Peticion de contraseña con el minimo de 6 caracteres
      if(passwordNueva.length < 6) {
        Swal.fire("Error", "La nueva contraseña debe tener por lo menos 6 caracteres", "error")
        return;
      }

      if(passwordNueva !== confirmarPassword){
        Swal.fire("Error", "Las contraseñas no coinciden", "error")
        return;
      }

      const confirm = await Swal.fire({
        title: "¿Actualizar contraseña?",
        text: "Tu contraseña sera cambiada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "Cancelar",
      });

      if(!confirm.isConfirmed) return;

      // Peticion del backend
      await Axios.put(`http://localhost:3000/api/perfil/${userId}/password`, {
        passwordActual, 
        passwordNueva,
      });

      Swal.fire("Exito", "Contraseña actualizada correctamente", "success");

      // Limpiamos los inputs
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
      setMostrarCambioPassword("");
    } catch (error){
      console.error(error);
      Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar la contraseña", "error");
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
        setFormData(perfil);
        setEditando(false);
        setImagenPreview(null);
        setImagenFile(null);
        
        setMostrarCambioPassword(false);
        setPasswordActual("");
        setNuevaPassword("");
        setConfirmarPassword("");

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

  if (!perfil) return <p className="perfil-contenedor-principal__cargando">Cargando perfil...</p>;

  return (
    <div className="perfil-contenedor-principal">
      <div className="perfil-contenedor">
        <h2 className="perfil-titulo">Perfil del Usuario</h2>

        <div className="perfil-contenido">
          <div className="perfil-imagen">
            <img
              src={
                imagenPreview
                  ? imagenPreview
                  : perfil.imagen
                  ? `http://localhost:3000/uploads/${perfil.imagen}`
                  : 'https://via.placeholder.com/150'
              }
              alt="Perfil"
              className="perfil-imagen__redonda"
            />
          </div>
          {editando && (
            <div className="perfil-formulario__cambiar-imagen">
              <label>Cambiar Imagen:</label>
              <label className="custom-file-upload">
                Seleccionar archivo
                <input type="file" accept="image/*" onChange={handleImagenChange} />
              </label>
            </div>
            )}

          <div className="perfil-formulario">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Primer Nombre" name="Primer_Nombre" value={formData.Primer_Nombre} onChange={handleChange} disabled={!editando} />
              <Input label="Segundo Nombre" name="Segundo_Nombre" value={formData.Segundo_Nombre} onChange={handleChange} disabled={!editando} />
              <Input label="Primer Apellido" name="Primer_Apellido" value={formData.Primer_Apellido} onChange={handleChange} disabled={!editando} />
              <Input label="Segundo Apellido" name="Segundo_Apellido" value={formData.Segundo_Apellido} onChange={handleChange} disabled={!editando} />
              <Input label="Tipo Documento" name="Tipo_documento" value={formData.Tipo_documento} onChange={handleChange} disabled={!editando} />
              <Input label="Número Documento" name="Numero_documento" value={formData.Numero_documento} onChange={handleChange} disabled={!editando} />
              <Input label="Número Celular" name="Numero_celular" value={formData.Numero_celular} onChange={handleChange} disabled={!editando} />
              <Input label="Correo Personal" name="Correo_personal" value={formData.Correo_personal} onChange={handleChange} disabled={!editando} />
              <Input label="Correo Empresarial" name="Correo_empresarial" value={formData.Correo_empresarial} onChange={handleChange} disabled={!editando}  />
              <Input label="Rol" value={formData.Rol} disabled />
            </div>

            

            {/* Cambio de contraseña */}
           
            <div className="cambiar-password-boton">
                <button onClick={() => setMostrarCambioPassword(!mostrarCambioPassword)} 
                  className="perfil-boton--editar">
                    {mostrarCambioPassword ? "Cerrar cambio de contraseña" : "Cambiar contraseña"}
                </button> 
            </div>
            
            
            {mostrarCambioPassword && (
              <div className="perfil-cambiar-password">
                <h3>Cambiar contraseña</h3>

                {/* Contraseña actual */}
                <InputPassword 
                  label="Contraseña actual"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  minLength="6" 
                />

                {/* Nueva contraseña */}
                <InputPassword 
                  label="Nueva contraseña (min 6 caracteres)"
                  value={passwordNueva}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  minLength="6" 
                />

                {/* Confrimacion de la contraseña */}
                <InputPassword 
                  label="Confirmar nueva contraseña (min 6 caracteres)"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  minLength="6" 
                />

              <button onClick={handleChangePassword} className="perfil-boton--guardar">
                Guardar la nueva contraseña
              </button>
              </div>
            )}

            <div className="perfil-botones">
              {editando ? (
                <>
                  <button onClick={guardarCambios} className="perfil-boton--guardar">
                    Guardar Cambios
                  </button>
                  <button onClick={cancelarEdicion} className="perfil-boton--cancelar">
                    Cancelar
                  </button>
                </>
              ) : (
                <button onClick={iniciarEdicion} className="perfil-boton--editar">
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
    <div className="perfil-campo-input">
      <label className="perfil-label">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className={`perfil-input ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      />
    </div>
  );
}

function InputPassword({ label, value, onChange, minLength = 8 }) {

  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(false);

  // Validacion de las contraseñas entre Letras + Numeros + Signos
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
  

    if(!regex.test(newValue)){
      setError("Debe contener letras, numeros y al menos un signo.");
    } else {
      setError("");
    }
  };

  return (
    <div className="perfil-campo-input">
      <label className="perfil-label">{label}</label>
      <div className="relative">
        {/* Peticion de la clave */}
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          minLength={minLength}
          className="perfil-input bg-white"
        />

        {/* Boton para ver la contraseña */}
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-gray-600"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>

        {/* Mensaje de error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default PerfilUsuario;
