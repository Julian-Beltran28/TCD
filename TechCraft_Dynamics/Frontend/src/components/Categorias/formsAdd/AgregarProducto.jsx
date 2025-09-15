import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditarProducto({ idSubcategoria }) {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const idCategoria = queryParams.get("categoria");

  // Variables globales
  const [tipoProducto, setTipoProducto] = useState(""); 
  const [imagenPreview, setImagenPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proveedores, setProveedores] = useState([]);

      // Definir URL base API una sola vez
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  // Paquete
  const [productoP, setProductoP] = useState({
    Nombre_producto: "",
    Precio: "",
    Descripcion: "",
    Codigo_de_barras: "",
    Stock: "",
    id_SubCategorias: idSubcategoria || "",
    id_Proveedor: "",
  });

  // Gramaje
  const [productoG, setProductoG] = useState({
    Nombre_producto: "",
    Kilogramos: "",
    Precio_kilogramo: "",
    Libras: "",
    Precio_libras: "",
    Descripcion: "",
    id_SubCategorias: idSubcategoria || "",
    id_Proveedor: "",
  });

  // Handlers
  const handleChangeProductoP = (e) => {
    const { name, value } = e.target;
    setProductoP({ ...productoP, [name]: value });
  };

  const handleChangeProductoG = (e) => {
    const { name, value } = e.target;
    setProductoG({ ...productoG, [name]: value });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  // Guardar
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    if (tipoProducto === "paquete") {
      const { Nombre_producto, Stock, Precio, id_Proveedor } = productoP;
      const precioEntero = parseInt(Precio.trim());
      const stockEntero = parseInt(Stock.trim());

      if (
        !Nombre_producto.trim() ||
        isNaN(precioEntero) ||
        precioEntero <= 0 ||
        isNaN(stockEntero) ||
        stockEntero < 0 ||
        !id_Proveedor
      ) {
        setIsSubmitting(false);
        return Swal.fire("Campos obligatorios", "Faltan datos del producto", "warning");
      }

      formData.append("Nombre_producto", productoP.Nombre_producto);
      formData.append("precio", precioEntero);
      formData.append("stock", stockEntero);
      formData.append("Descripcion", productoP.Descripcion);
      formData.append("Codigo_de_barras", productoP.Codigo_de_barras);
      formData.append("id_Proveedor", productoP.id_Proveedor);
      formData.append("id_SubCategorias", productoP.id_SubCategorias);
      formData.append("tipo_producto", "paquete");
    } else if (tipoProducto === "gramaje") {
      const {
        Nombre_producto,
        Kilogramos,
        Precio_kilogramo,
        Libras,
        Precio_libras,
        id_Proveedor,
      } = productoG;

      const kg = parseFloat(Kilogramos);
      const precioKg = parseFloat(Precio_kilogramo);
      const lb = parseFloat(Libras);
      const precioLb = parseFloat(Precio_libras);

      if (
        !Nombre_producto.trim() ||
        isNaN(kg) ||
        kg <= 0 ||
        isNaN(precioKg) ||
        precioKg <= 0 ||
        isNaN(lb) ||
        lb <= 0 ||
        isNaN(precioLb) ||
        precioLb <= 0 ||
        !id_Proveedor
      ) {
        setIsSubmitting(false);
        return Swal.fire("Campos obligatorios", "Faltan datos del producto", "warning");
      }

      formData.append("Nombre_producto", productoG.Nombre_producto);
      formData.append("Kilogramos", kg);
      formData.append("Precio_kilogramo", precioKg);
      formData.append("Libras", lb);
      formData.append("Precio_libras", precioLb);
      formData.append("Descripcion", productoG.Descripcion);
      formData.append("id_Proveedor", productoG.id_Proveedor);
      formData.append("id_SubCategorias", productoG.id_SubCategorias);
      formData.append("tipo_producto", "gramaje");
    } else {
      setIsSubmitting(false);
      return Swal.fire("Error", "Debes seleccionar un tipo de producto", "error");
    }

    if (selectedFile) {
      formData.append("imagen", selectedFile);
    }

    try {
      await axios.post(`${API_URL}/api/productos`, formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Subida: ${percent}%`);
        },
      });

      Swal.fire("✅ Guardado", "Producto agregado correctamente", "success").then(() => {
        navigate(`/admin/Categoria/${idCategoria}`);
      });
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/proveedores/listar`);
        setProveedores(res.data.proveedores || res.data.data || []);
      } catch (err) {
        console.error("❌ Error proveedores:", err);
        Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
      }
    };
    fetchProveedores();
  }, [API_URL]);

  const handleCancelar = () => {
    Swal.fire({
      title: "Cancelado",
      text: "El proceso se canceló con éxito.",
      icon: "warning",
      timer: 1000,
      showConfirmButton: false,
    }).then(() => navigate(-1));
  };

  return (
    <>
      <h1 className="titulo">AGREGAR PRODUCTO NUEVO</h1>
      <main className="contenedor-principal">
        <div className="Formulario-producto">
          {/* Selección tipo */}
          <label htmlFor="tipo">Tipo de producto</label>
          <select
            className="form-control"
            id="tipo"
            value={tipoProducto}
            onChange={(e) => setTipoProducto(e.target.value)}
          >
            <option value="">--Selecciona una opción--</option>
            <option value="paquete">Productos en paquetes</option>
            <option value="gramaje">Productos en gramaje</option>
          </select>

          {/* Formulario Paquete */}
          {tipoProducto === "paquete" && (
            <form onSubmit={handleSubmit} className="datos card p-4 shadow">
              <div className="row mb-3">
                <div className="col-md-4 text-center">
                  {/* Imagen */}
                  <div
                    className="rounded-circle bg-secondary mx-auto mb-2"
                    style={{
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {imagenPreview ? (
                      <img src={imagenPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "12px" }}>Sin imagen</span>
                    )}
                  </div>
                  <label className="btn btn-primary btn-sm">
                    Selecciona una imagen
                    <input type="file" accept="image/*" onChange={handleImagenChange} hidden />
                  </label>
                </div>

                <div className="col-md-8">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="Nombre_producto" value={productoP.Nombre_producto} onChange={handleChangeProductoP} />

                  <label className="form-label">Stock</label>
                  <input type="number" className="form-control" name="Stock" value={productoP.Stock} onChange={handleChangeProductoP} />

                  <label className="form-label">Precio</label>
                  <input type="number" className="form-control" name="Precio" value={productoP.Precio} onChange={handleChangeProductoP} />

                  <label className="form-label">Código de barras</label>
                  <input type="number" className="form-control" name="Codigo_de_barras" value={productoP.Codigo_de_barras} onChange={handleChangeProductoP} />

                  <label className="form-label">Proveedor</label>
                  <select className="form-control" name="id_Proveedor" value={productoP.id_Proveedor} onChange={handleChangeProductoP}>
                    <option value="">--Selecciona--</option>
                    {proveedores.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre_empresa}
                      </option>
                    ))}
                  </select>

                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" rows="4" name="Descripcion" value={productoP.Descripcion} onChange={handleChangeProductoP}></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Formulario Gramaje */}
          {tipoProducto === "gramaje" && (
            <form onSubmit={handleSubmit} className="datos card p-4 shadow">
              <div className="row mb-3">
                <div className="col-md-4 text-center">
                  {/* Imagen */}
                  <div
                    className="rounded-circle bg-secondary mx-auto mb-2"
                    style={{
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {imagenPreview ? (
                      <img src={imagenPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "12px" }}>Sin imagen</span>
                    )}
                  </div>
                  <label className="btn btn-primary btn-sm">
                    Selecciona una imagen
                    <input type="file" accept="image/*" onChange={handleImagenChange} hidden />
                  </label>
                </div>

                <div className="col-md-8">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" name="Nombre_producto" value={productoG.Nombre_producto} onChange={handleChangeProductoG} />

                  <label className="form-label">Kilogramos</label>
                  <input type="number" className="form-control" name="Kilogramos" value={productoG.Kilogramos} onChange={handleChangeProductoG} />

                  <label className="form-label">Precio / kg</label>
                  <input type="number" className="form-control" name="Precio_kilogramo" value={productoG.Precio_kilogramo} onChange={handleChangeProductoG} />

                  <label className="form-label">Libras</label>
                  <input type="number" className="form-control" name="Libras" value={productoG.Libras} onChange={handleChangeProductoG} />

                  <label className="form-label">Precio / lb</label>
                  <input type="number" className="form-control" name="Precio_libras" value={productoG.Precio_libras} onChange={handleChangeProductoG} />

                  <label className="form-label">Proveedor</label>
                  <select className="form-control" name="id_Proveedor" value={productoG.id_Proveedor} onChange={handleChangeProductoG}>
                    <option value="">--Selecciona--</option>
                    {proveedores.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre_empresa}
                      </option>
                    ))}
                  </select>

                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" rows="4" name="Descripcion" value={productoG.Descripcion} onChange={handleChangeProductoG}></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
