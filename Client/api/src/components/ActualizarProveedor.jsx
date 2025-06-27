import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';


// Coge y muestra los datos que ya tenia el proveedor para poder modificarlos.
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

  useEffect(() => {
    Axios.get(`http://localhost:5000/proveedores/${id}`)
      .then(res => {
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

    let imagenBase64 = imagenActual;
    if (imagen) {
      // Si el usuario selecciona una nueva imagen, convertirla a base64
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      try {
        imagenBase64 = await toBase64(imagen);
      } catch (error) {
        return Swal.fire('Error', 'No se pudo procesar la imagen.', 'error');
      }
    }

    try {
      await Axios.put(`http://localhost:5000/actualizar/${id}`, {
        nombre,
        exportacion,
        represent,
        apellido,
        numero,
        correo,
        imagen: imagenBase64
      });
      Swal.fire('Proveedor actualizado', 'Los datos del proveedor han sido actualizados.', 'success');
      navigate('/');
    } catch (error) {
      Swal.fire('Error al actualizar', error.message, 'error');
    }
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Cancelado.',
      text: 'El proceso se canceló con éxito.',
      icon: 'warning',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    }).then(() => {
      navigate('/');
    });
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
            src={imagenActual.startsWith('data:') ? imagenActual : `http://localhost:5000/uploads/${imagenActual}`}
            alt="Imagen del Proveedor"
            width="100"
            height="100"
            style={{ objectFit: 'cover', borderRadius: '5px' }}
          />
        </div>
      )}
      <button className="btn btn-success" onClick={actualizarProveedor}>Actualizar</button>
      <button className="btn btn-success ms-2" onClick={handleCancelar}>Cancelar</button>
    </div>
  );
}

export default ActualizarProveedor;