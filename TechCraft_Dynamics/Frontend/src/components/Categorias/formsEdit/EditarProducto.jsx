// Importaciones necesarias
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditarProducto({ idSubcategoria }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const idCategoria = queryParams.get("categoria");

  const [tipoProducto, setTipoProducto] = useState("");
  const [imagenPreview, setImagenPreview] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [producto, setProducto] = useState({
    Imagen_producto: "",
    Nombre_producto: "",
    precio: "",
    Kilogramos: "",
    Precio_kilogramo: "",
    Libras: "",
    Precio_libras: "",
    Descripcion: "",
    Codigo_de_barras: "",
    id_SubCategorias: idSubcategoria || "",
    id_Proveedor: "",
    tipo_producto: "",
  });

  // Conexion Local o con el Railway
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  // Cargar producto
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/${id}`);
        const data = res.data;

        setProducto({
          Imagen_producto: data.Imagen_producto || "",
          Nombre_producto: data.Nombre_producto || "",
          precio: data.precio || "",
          Kilogramos: data.Kilogramos || "",
          Precio_kilogramo: data.Precio_kilogramo || "",
          Libras: data.Libras || "",
          Precio_libras: data.Precio_libras || "",
          Descripcion: data.Descripcion || "",
          Codigo_de_barras: data.Codigo_de_barras || "",
          id_SubCategorias: data.id_SubCategorias || idSubcategoria || "",
          id_Proveedor: data.id_Proveedor || "",
          tipo_producto: data.tipo_producto || "",
        });

        setTipoProducto(data.tipo_producto || "");
        if (data.Imagen_producto) {
          setImagenPreview(`${API_URL}/uploads/${data.Imagen_producto}`);
        }
      } catch (error) {
        console.error("❌ Error al cargar producto:", error);
        Swal.fire("Error", "No se pudo cargar el producto", "error");
      }
    };

    fetchProducto();
  }, [id, idSubcategoria, API_URL]);

  // Cargar proveedores
  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/proveedores/listar`);
        const proveedoresArray =
          res.data.proveedores || res.data.data || res.data;
        setProveedores(Array.isArray(proveedoresArray) ? proveedoresArray : []);
      } catch (error) {
        console.error("❌ Error al cargar proveedores:", error);
        Swal.fire("Error", "No se pueden cargar los proveedores", "error");
      }
    };

    obtenerProveedores();
  }, [API_URL]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Creamos un objeto combinando producto + tipo_producto
    const productoEnviar = { ...producto, tipo_producto: tipoProducto };

    const formData = new FormData();
    for (let key in productoEnviar) {
      formData.append(key, productoEnviar[key]);
    }

    // Solo agregamos la imagen si el usuario seleccionó una nueva
    if (selectedFile) {
      formData.append("imagen", selectedFile);
    }

    await axios.put(`${API_URL}/api/productos/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire("✅ Actualizado", "El producto se actualizó con éxito", "success").then(() =>
      navigate(`/admin/Categoria/${idCategoria}`)
    );
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    Swal.fire("Error", "No se pudo actualizar el producto", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  // Cancelar edicion de producto
  const handleCancelar = () => {
    Swal.fire({
      title: "Cancelado",
      text: "El proceso se canceló con éxito.",
      icon: "warning",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    }).then(() => {
      navigate(-1);
    });
  };

  return (
    <>
      <h1 className="titulo">EDITAR PRODUCTO</h1>

      <main className="contenedor-principal">
        <div className="Formulario-producto">
          <label htmlFor="tipo">Tipo de producto</label>
          <select
            className="form-control"
            id="tipo"
            value={tipoProducto}
            onChange={(e) => setTipoProducto(e.target.value)}
          >
            {/* Seleccion de producto */}
            <option value="">--Selecciona una opción--</option>
            <option value="paquete">Producto en paquete</option>
            <option value="gramaje">Producto en gramaje</option>
          </select>

          <div className="datos card p-4 shadow mt-3">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="mb-3 text-center">
                    {/* Diseño de la imagen del producto */}
                    <div
                      className="rounded-circle mx-auto mb-2"
                      style={{
                        width: "120px",
                        height: "120px",
                        backgroundColor: "#ccc",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Imagen del producto */}
                      {imagenPreview ? (
                        <img
                          src={imagenPreview}
                          alt="preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ color: "#666", fontSize: "12px" }}>
                          Sin imagen
                        </span>
                      )}
                    </div>
                    <label className="btn btn-primary btn-sm">
                      Selecciona una imagen
                      <input type="file" accept="image/*" onChange={handleImagenChange} hidden />
                    </label>
                  </div>
                  
                  {/* Nombre del producto */}
                  <label className="form-label">Nombre del producto:</label>
                  <input
                    type="text"
                    name="Nombre_producto"
                    className="form-control"
                    value={producto.Nombre_producto}
                    onChange={handleChange}
                  />
                  {/* Seleccion de proveedor */}
                  <label className="form-label">Proveedor:</label>
                  <select
                    name="id_Proveedor"
                    className="form-control"
                    value={producto.id_Proveedor}
                    onChange={handleChange}
                  > 
                  {/* Ciclo de proveedor */}
                    <option value="">--Selecciona un proveedor--</option>
                    {proveedores.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre_empresa}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-8">
                  {/* Formulario de productos tipo Paquete */}
                  {tipoProducto === "paquete" && (
                    <>
                    {/* Precio del producto */}
                      <label className="form-label">Precio:</label>
                      <input
                        type="number"
                        name="precio"
                        className="form-control"
                        value={producto.precio}
                        onChange={handleChange}
                      />
                    </>
                  )}
                  {/* Tipo de gramaje */}
                  {tipoProducto === "gramaje" && (
                    <>
                    {/* Peso KG */}
                      <label className="form-label">Peso en kilos:</label>
                      <input
                        type="number"
                        name="Kilogramos"
                        className="form-control"
                        value={producto.Kilogramos}
                        onChange={handleChange}
                      />
                      {/* Precio KG */}
                      <label className="form-label">Precio por kilo:</label>
                      <input
                        type="number"
                        name="Precio_kilogramo"
                        className="form-control"
                        value={producto.Precio_kilogramo}
                        onChange={handleChange}
                      />
                      {/* Peso LB */}
                      <label className="form-label">Peso en libras:</label>
                      <input
                        type="number"
                        name="Libras"
                        className="form-control"
                        value={producto.Libras}
                        onChange={handleChange}
                      />
                      {/* Precio LB */}
                      <label className="form-label">Precio por libra:</label>
                      <input
                        type="number"
                        name="Precio_libras"
                        className="form-control"
                        value={producto.Precio_libras}
                        onChange={handleChange}
                      />
                    </>
                  )}
                  {/* Codigo de Barras */}
                  <label className="form-label">Código de barras:</label>
                  <input
                    type="text"
                    name="Codigo_de_barras"
                    className="form-control"
                    value={producto.Codigo_de_barras}
                    onChange={handleChange}
                  />
                  {/* Descripcion */}
                  <label className="form-label">Descripción:</label>
                  <textarea
                    name="Descripcion"
                    rows="6"
                    className="form-control"
                    value={producto.Descripcion || ""}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              {/* Botones */}
              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleCancelar}>
                  Regresar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
