import React, { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function CrearProveedor() {
  const [nombre, setNombre] = useState("");
  const [exportacion, setExportacion] = useState("");
  const [represent, setRepresent] = useState("");
  const [apellido, setApellido] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState(null);
  const navigate = useNavigate();

  const add = async (e) => {
    e.preventDefault();
    if (!nombre || !exportacion || !represent || !apellido || !numero || !correo || !imagen) {
      return Swal.fire('Faltan datos', 'Completa todos los campos.', 'warning');
    }

    const formData = new FormData();
    formData.append('nombre_empresa', nombre);
    formData.append('tipo_exportacion', exportacion);
    formData.append('nombre_representante', represent);
    formData.append('apellido_representante', apellido);
    formData.append('numero_empresarial', numero);
    formData.append('correo_empresarial', correo);
    formData.append('imagen_empresa', imagen);

    try {
      await Axios.post("http://localhost:3000/api/proveedores", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Registrado', `Proveedor ${nombre} creado.`, 'success');
      navigate('/admin/proveedores');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || error.message, 'error');
    }
  };

  return (
    <div className="container mt-3">
      <h2>Agregar Proveedor</h2>
      <input type="text" className="form-control" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="text" className="form-control" placeholder="Tipo de Exportación" value={exportacion} onChange={(e) => setExportacion(e.target.value)} />
      <input type="text" className="form-control" placeholder="Nombre del Representante" value={represent} onChange={(e) => setRepresent(e.target.value)} />
      <input type="text" className="form-control" placeholder="Apellido del Representante" value={apellido} onChange={(e) => setApellido(e.target.value)} />
      <input type="text" className="form-control" placeholder="Contacto Empresa" value={numero} onChange={(e) => setNumero(e.target.value)} />
      <input type="email" className="form-control" placeholder="Correo Empresarial" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input type="file" className="form-control" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
      <button className="btn btn-success mt-2" onClick={add}>Registrar</button>
    </div>
  );
}

export default CrearProveedor;
