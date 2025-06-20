import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

function ActualizarProveedor() {
  const { id } = useParams(); // Obtiene el ID del proveedor de la URL
  const navigate = useNavigate(); // Para redirigir después de la actualización
  const [nombre, setNombre] = useState("");
  const [exportacion, setExportacion] = useState("");
  const [represent, setRepresent] = useState("");
  const [apellido, setApellido] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState(""); // Para mostrar la imagen actual

  useEffect(() => {
    // Obtener los datos del proveedor al cargar el componente
    Axios.get(`http://localhost:5000/proveedores/${id}`)
      .then(res => 
        {
        const prov = res.data;
        setNombre(prov.nombre_empresa);
        setExportacion(prov.tipo_exportacion);
        setRepresent(prov.nombre_representante);
        setApellido(prov.apellido_representante);
        setNumero(prov.numero_empresarial);
        setCorreo(prov.correo_empresarial);
        setImagenActual(prov.imagen_empresa); // Guardar la imagen actual
      })
      .catch(err => Swal.fire('Error al obtener proveedor', err.message, 'error'));
  }, [id]);

  const actualizarProveedor = async () => {
    if (!nombre || !exportacion || !represent || !apellido || !numero || !correo) {
      return Swal.fire('Faltan datos', 'Por favor, completa todos los campos.', 'warning');
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("exportacion", exportacion);
    formData.append("represent", represent);
    formData.append("apellido", apellido);
    formData.append("numero", numero);
    formData.append("correo", correo);
    if (imagen) {
      formData.append("imagen", imagen); // Solo agregar la nueva imagen si se ha seleccionado
    }

    try {
      await Axios.put(`http://localhost:5000/actualizar/${id}`, formData);
      Swal.fire('Proveedor actualizado', 'Los datos del proveedor han sido actualizados.', 'success');
      navigate('/listar'); // Redirigir a la lista de proveedores
    } catch (error) {
      Swal.fire('Error al actualizar', error.message, 'error');
    }
  };

  return (
    <div className="container mt-3">
      <h2>Actualizar Proveedor</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="text" className="form-control" placeholder="Tipo de Exportación" value={exportacion} onChange={(e) => setExportacion(e.target.value)} />
        <input type="text" className="form-control" placeholder="Nombre del Representante" value={represent} onChange={(e) => setRepresent(e.target.value)} />
        <input type="text" className="form-control" placeholder="Apellido del Representante" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        <input type="text" className="form-control" placeholder="Contacto Empresa" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <input type="email" className="form-control" placeholder="Correo Empresarial" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <input type="file" className="form-control" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
      </div>
      {imagenActual && (
        <div className="mb-3">
          <h5>Imagen Actual:</h5>
          <img
            src={`http://localhost:5000/uploads/${imagenActual}`} // Ruta de la imagen actual
            alt="Imagen del Proveedor"
            width="100"
            height="100"
            style={{ objectFit: 'cover', borderRadius: '5px' }}
          />
        </div>
      )}
      <button className="btn btn-success" onClick={actualizarProveedor}>Actualizar</button>
    </div>
  );
}

export default ActualizarProveedor;
