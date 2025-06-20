import React, { useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; // Importa Link

function CrearProveedor() {
  const [nombre, setNombre] = useState("");
  const [exportacion, setExportacion] = useState("");
  const [represent, setRepresent] = useState("");
  const [apellido, setApellido] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState(null);

  const add = async () => {
    if (!nombre || !exportacion || !represent || !apellido || !numero || !correo || !imagen) {
      return Swal.fire('Faltan datos', 'Por favor, completa todos los campos.', 'warning');
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("exportacion", exportacion);
    formData.append("represent", represent);
    formData.append("apellido", apellido);
    formData.append("numero", numero);
    formData.append("correo", correo);
    formData.append("imagen", imagen);

    try {
      await Axios.post("http://localhost:5000/registrar", formData);
      Swal.fire('Proveedor registrado', `El proveedor ${nombre} ha sido registrado.`, 'success');
      limpiarCampos();
    } catch (error) {
      Swal.fire('Error al registrar', error.message, 'error');
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setExportacion("");
    setRepresent("");
    setApellido("");
    setNumero("");
    setCorreo("");
    setImagen(null);
  };

  return (
    <div className="container mt-3">
      <h2>Registrar Proveedor</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Nombre Empresa" onChange={(e) => setNombre(e.target.value)} />
        <input type="text" className="form-control" placeholder="Tipo de Exportación" onChange={(e) => setExportacion(e.target.value)} />
        <input type="text" className="form-control" placeholder="Nombre del Representante" onChange={(e) => setRepresent(e.target.value)} />
        <input type="text" className="form-control" placeholder="Apellido del Representante" onChange={(e) => setApellido(e.target.value)} />
        <input type="text" className="form-control" placeholder="Contacto Empresa" onChange={(e) => setNumero(e.target.value)} />
        <input type="email" className="form-control" placeholder="Correo Empresarial" onChange={(e) => setCorreo(e.target.value)} />
        <input type="file" className="form-control" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
      </div>
      <button className="btn btn-primary" onClick={add}>Registrar</button>

      <Link to="/" className="btn btn-secondary mt-3">Consultar Proveedores</Link>
    </div>
  );
}

export default CrearProveedor;
