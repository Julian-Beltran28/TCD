// Importaciones necesarias
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
// Css
import '../../css/Proveedores/CrearProveedor.css';

function ActualizarProveedor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [exportacion, setExportacion] = useState("");
  const [represent, setRepresent] = useState("");
  const [apellido, setApellido] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState("");

  // Conexion Local o con el Railway
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';
  
  // Muestra los datos del proveedor seleccionado previamente
  useEffect(() => {
    Axios.get(`${API_URL}/api/proveedores/${id}`)
      .then(res => {
        const prov = res.data;
        setNombre(prov.nombre_empresa);
        setExportacion(prov.tipo_exportacion);
        setRepresent(prov.nombre_representante);
        setApellido(prov.apellido_representante);
        setNumero(prov.numero_empresarial);
        setCorreo(prov.correo_empresarial);
        setImagenActual(prov.imagen_empresa);
      })
      .catch(err => Swal.fire('Error al obtener proveedor', err.message, 'error'));
  }, [id]);

  // Actualiza los datos del proveedor 
  const actualizarProveedor = async () => {
    const formData = new FormData();
    formData.append("nombre_empresa", nombre);
    formData.append("tipo_exportacion", exportacion);
    formData.append("nombre_representante", represent);
    formData.append("apellido_representante", apellido);
    formData.append("numero_empresarial", numero);
    formData.append("correo_empresarial", correo);
    if (imagen) formData.append("imagen_empresa", imagen);

    // Guarda los datos actualizados en la Base de Datos
    try {
      await Axios.put(`${API_URL}/api/proveedores/${id}`, formData);
      Swal.fire('Actualizado', 'Proveedor actualizado correctamente.', 'success');
      navigate('/admin/proveedores');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

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

  return (
  <div className="actualizarproveedor-contenedor-dashboard">
    <div className="container mt-3">
      <h2 className="Usuario-titulo text-center mb-4">Actualizar proveedor</h2>

      {/* Formulario */}
      <div className="Usuario-formulario-box">
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
                      <img src={`${API_URL}/uploads/${imagenActual}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                        <span style={{ color: "#080808ff", fontSize: "12px" }}>Sin imagen </span>
                    )}
              </div>
                <label className="btn btn-primary btn-sm">Seleciona una imagen
                  <input type="file" className="form-control mb-3" accept="image/" onChange={(e) => setImagen(e.target.files[0])}  hidden />
                </label>
            </div>
        {/* Nombre Empresa */}
        <input type="text" className="form-control mb-2" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {/* Nombre Representante */}
        <input type="text" className="form-control mb-2" placeholder="Nombre Representante" value={represent} onChange={(e) => setRepresent(e.target.value)} />
        {/* Apellido Representante */}
        <input type="text" className="form-control mb-2" placeholder="Apellido Representante" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        {/* Numero Empresarial */}
        <input type="text" className="form-control mb-2" placeholder="Número Empresarial" value={numero} onChange={(e) => setNumero(e.target.value)} />
        {/* Correo Empresarial */}
        <input type="email" className="form-control mb-2" placeholder="Correo Empresarial" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        {/* Boton */}
        <button className="btn btn-success mt-2" onClick={actualizarProveedor}>Actualizar</button>
        <button className="btn btn-success m-2" onClick={handleCancelar}>Cancelar</button>
      </div>
    </div>
  </div>
);
}

export default ActualizarProveedor;