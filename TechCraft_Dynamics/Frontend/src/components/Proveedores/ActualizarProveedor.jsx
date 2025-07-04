import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

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
    Axios.get(`http://localhost:3000/api/proveedores/${id}`)
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

  const actualizarProveedor = async () => {
    const formData = new FormData();
    formData.append("nombre_empresa", nombre);
    formData.append("tipo_exportacion", exportacion);
    formData.append("nombre_representante", represent);
    formData.append("apellido_representante", apellido);
    formData.append("numero_empresarial", numero);
    formData.append("correo_empresarial", correo);
    if (imagen) formData.append("imagen_empresa", imagen);

    try {
      await Axios.put(`http://localhost:3000/api/proveedores/${id}`, formData);
      Swal.fire('Actualizado', 'Proveedor actualizado correctamente.', 'success');
      navigate('/admin/proveedores');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="container mt-3">
      <h2>Actualizar Proveedor</h2>
      <input type="text" className="form-control" placeholder="Nombre Empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="text" className="form-control" placeholder="Tipo de Exportación" value={exportacion} onChange={(e) => setExportacion(e.target.value)} />
      <input type="text" className="form-control" placeholder="Nombre Representante" value={represent} onChange={(e) => setRepresent(e.target.value)} />
      <input type="text" className="form-control" placeholder="Apellido Representante" value={apellido} onChange={(e) => setApellido(e.target.value)} />
      <input type="text" className="form-control" placeholder="Número Empresarial" value={numero} onChange={(e) => setNumero(e.target.value)} />
      <input type="email" className="form-control" placeholder="Correo Empresarial" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input type="file" className="form-control" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
      {imagenActual && (
        <img src={`http://localhost:3000/uploads/${imagenActual}`} alt="Actual" width={100} height={100} />
      )}
      <button className="btn btn-success mt-2" onClick={actualizarProveedor}>Actualizar</button>
    </div>
  );
}

export default ActualizarProveedor;
