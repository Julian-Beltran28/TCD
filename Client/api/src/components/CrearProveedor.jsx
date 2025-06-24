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
      return Swal.fire('Faltan datos', 'Por favor, completa todos los campos.', 'warning');
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('exportacion', exportacion);
    formData.append('represent', represent);
    formData.append('apellido', apellido);
    formData.append('numero', numero);
    formData.append('correo', correo);
    formData.append('imagen', imagen);

    try {
      await Axios.post("http://localhost:5000/registrar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire('Proveedor registrado', `El proveedor ${nombre} ha sido registrado.`, 'success');
      limpiarCampos();
      navigate('/'); // Redirige al inicio después de registrar
    } catch (error) {
      Swal.fire('Error al registrar', error.response?.data?.error || error.message, 'error');
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

  const handleCancelar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Cancelado.',
      text: 'El proceso se canceló con éxito.',
      icon: 'warning',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="container mt-3">
      <h2>Agregar Proveedor</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="text" className="form-control" placeholder="Tipo de Exportación" value={exportacion} onChange={(e) => setExportacion(e.target.value)} />
        <input type="text" className="form-control" placeholder="Nombre del Representante" value={represent} onChange={(e) => setRepresent(e.target.value)} />
        <input type="text" className="form-control" placeholder="Apellido del Representante" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        <input type="text" className="form-control" placeholder="Contacto Empresa" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <input type="email" className="form-control" placeholder="Correo Empresarial" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <input type="file" className="form-control" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
      </div>
      <div className='Botones-registro'>
        <button className="btn btn-success" onClick={add}>Registrar</button>
        <button className="btn btn-success" onClick={handleCancelar}>Cancelar</button>
      </div>
    </div>
  );
}

export default CrearProveedor;