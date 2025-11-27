// Importacion necesarias
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
// Css
import '../../css/Proveedores/CrearProveedor.css';

function CrearProveedor() {
  const [nombre, setNombre] = useState("");
  const [represent, setRepresent] = useState("");
  const [apellido, setApellido] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState(null);
  const navigate = useNavigate();

  // Conexion Local o con el Railway
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  // Cancelar el registro
  const handleCancelar = () => {
    Swal.fire({
      title: 'Cancelado',
      text: 'Registro cancelado.',
      icon: 'info',
      timer: 1200,
      showConfirmButton: false
    });
    setTimeout(() => {
      navigate('/admin/proveedores');
    }, 1200);
  };
  // Agrega al proveedor si se cumple los campos
  const add = async (e) => {
    e.preventDefault();
    if (!nombre|| !represent || !apellido || !numero || !correo || !imagen) {
      return Swal.fire('Faltan datos', 'Completa todos los campos.', 'warning');
    }

    const formData = new FormData();
    formData.append('nombre_empresa', nombre);
    formData.append('nombre_representante', represent);
    formData.append('apellido_representante', apellido);
    formData.append('numero_empresarial', numero);
    formData.append('correo_empresarial', correo);
    formData.append('imagen_empresa', imagen);

    // Lo guarda en la Base de Datos
    try {
      await Axios.post(`${API_URL}/api/proveedores`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Registrado', `Proveedor ${nombre} creado.`, 'success');
      navigate('/admin/proveedores');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || error.message, 'error');
    }
  };

  return (
    <div className="crearproveedor">
      <div className="crearproveedor-container container mt-3">
        <h2 className="Usuario-titulo text-center mb-4">Registrar proveedor</h2>

        {/* Formulario del Proveedor */}
        <div className="Usuario-formulario-box">
          <form onSubmit={add}>
            <div className="text-center mb-3 d-flex flex-column align-items-center">

              {/* Imagen */}
              <div className="rounded-circle bg-secondary mx-auto mb-2" 
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                      >
                    {imagen ? (
                      <img src={URL.createObjectURL(imagen)} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                        <span style={{ color: "#080808ff", fontSize: "12px" }}>Sin imagen </span>
                    )}
              </div>
                <label className="btn btn-primary btn-sm">Seleciona una imagen
                  <input type="file" className="form-control mb-3" accept="image/" onChange={(e) => setImagen(e.target.files[0])}  hidden />
                </label>
            </div>

            {/* Nombre de la empresa */}
            <input type="text" className="form-control mb-2" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            {/* Nombre del representante */}
            <input type="text" className="form-control mb-2" placeholder="Nombre del Representante" value={represent} onChange={(e) => setRepresent(e.target.value)} />
            {/* Apellido del representante */}
            <input type="text" className="form-control mb-2" placeholder="Apellido del Representante" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            {/* Contacto de la Empresa */}
            <input type="text" className="form-control mb-2" placeholder="Contacto Empresa" value={numero} onChange={(e) => setNumero(e.target.value)} />
            {/* Correo Empresarial */}
            <input type="email" className="form-control mb-2" placeholder="Correo Empresarial" value={correo} onChange={(e) => setCorreo(e.target.value)} />

            {/* Botones */}
            <div className="crearproveedor-botones-registro">
              <button type="submit" className="crearproveedor-btn btn btn-success m-2">Registrar</button>
              <button type="button" className="crearproveedor-btn btn btn-success m-2" onClick={handleCancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearProveedor;
