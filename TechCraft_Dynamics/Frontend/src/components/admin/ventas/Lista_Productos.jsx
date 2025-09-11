// src/components/admin/ventas/ListaProductos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../css/admin/ventas/Lista_Productos.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";

const ListaProductos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rol = user?.rol;

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [descuentos, setDescuentos] = useState({});
  const [search, setSearch] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoPago, setCargandoPago] = useState(false);

  const productosPorPagina = 5;



  // Obtener productos
useEffect(() => {
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`);
      const normalizados = res.data.map(p => ({
        ...p,
        tipo: (p.tipo_producto || "").toString().trim().toLowerCase()
      }));
      setProductos(normalizados);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };
  obtenerProductos();
}, []);


  // ---- Carrito
  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const existente = prev[prod.id];
      return {
        ...prev,
        [prod.id]: {
          cantidad: existente
            ? existente.cantidad + (prod.tipo === "gramaje" ? 100 : 1)
            : (prod.tipo === "gramaje" ? 100 : 1),
          tipo: prod.tipo
        }
      };
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => {
      const nuevo = { ...prev };
      if (!nuevo[id]) return prev;
      const resta = nuevo[id].tipo === "gramaje" ? 100 : 1;
      const nuevaCant = (nuevo[id].cantidad || 0) - resta;
      if (nuevaCant > 0) nuevo[id].cantidad = nuevaCant;
      else delete nuevo[id];
      return nuevo;
    });
  };

  const eliminarProducto = (id) => {
    setCarrito(prev => {
      const nuevo = { ...prev };
      delete nuevo[id];
      return nuevo;
    });
  };

  const setCantidadManual = (prod, rawValue) => {
    const val = Number(rawValue);
    if (Number.isNaN(val)) return;
    setCarrito(prev => {
      const nuevo = { ...prev };
      // 0 o vacío => sacar del carrito
      if (!val || val <= 0) {
        delete nuevo[prod.id];
        return nuevo;
      }
      // Para paquete: enteros; para gramaje: gramos
      const cantidad = prod.tipo === 'paquete' ? Math.floor(val) : Math.floor(val);
      nuevo[prod.id] = { tipo: prod.tipo, cantidad };
      return nuevo;
    });
  };

  const incrementar = (prod) => {
    setCarrito(prev => {
      const actual = prev[prod.id]?.cantidad || 0;
      const delta = prod.tipo === 'gramaje' ? 100 : 1;
      return { ...prev, [prod.id]: { tipo: prod.tipo, cantidad: actual + delta } };
    });
  };

  const decrementar = (prod) => {
    setCarrito(prev => {
      const actual = prev[prod.id]?.cantidad || 0;
      const delta = prod.tipo === 'gramaje' ? 100 : 1;
      const nueva = actual - delta;
      const copia = { ...prev };
      if (nueva > 0) copia[prod.id] = { tipo: prod.tipo, cantidad: nueva };
      else delete copia[prod.id];
      return copia;
    });
  };

  // Precio formateado
  const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);

  // Precio unitario según tipo
  // paquete => precio por unidad
  // gramaje => precio por gramo (Precio_kilogramo / 1000)
  const obtenerPrecioUnitario = (p) => {
    if (p.tipo === 'paquete') return Number(p.precio) || 0;
    if (p.tipo === 'gramaje') return (Number(p.Precio_kilogramo) || 0) / 1000; // por gramo
    return 0;
  };

  
  // Subtotal con descuento
  const calcularSubtotal = (producto, cantidad, descuento) => {
    if (!producto) return 0;
    const precioUnitario = obtenerPrecioUnitario(producto);
    const subtotal = precioUnitario * cantidad;
    return subtotal * (1 - (descuento || 0) / 100);
  };

  // Filtro + paginación
  const productosFiltrados = productos.filter(p =>
    (p.Nombre_producto && p.Nombre_producto.toLowerCase().includes(search.toLowerCase())) ||
    (p.Codigo_de_barras && p.Codigo_de_barras.includes(search))
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // Totales
  const totalCarrito = Object.entries(carrito).reduce((total, [id, item]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    const desc = descuentos[id] || 0;
    return total + calcularSubtotal(prod, item.cantidad, desc);
  }, 0);

  const totalDescuento = Object.entries(carrito).reduce((total, [id, item]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    if (!prod) return total;
    const precioBase = obtenerPrecioUnitario(prod) * item.cantidad;
    return total + (precioBase * (descuentos[id] || 0) / 100);
  }, 0);

  // Conteo de ítems (líneas) en el carrito
  const totalItems = Object.keys(carrito).length;

  // Ir al pago
  const irAPago = () => {
    if (!localStorage.getItem("token")) {
      alert("Debes iniciar sesión antes de pagar.");
      navigate("/login");
      return;
    }
    if (Object.keys(carrito).length === 0) {
      alert("Debe agregar productos al carrito antes de continuar.");
      return;
    }

    const rolNormalizado = rol?.toLowerCase();
    let basePath = "";
    if (rolNormalizado === "personal") basePath = "staff";
    else if (["staff", "supervisor", "admin"].includes(rolNormalizado)) basePath = rolNormalizado;
    else {
      alert("Rol de usuario desconocido. No se puede proceder al pago.");
      return;
    }

    setCargandoPago(true);
    setTimeout(() => {
      navigate(`/${basePath}/pago`, {
        state: {
          carrito,
          descuentos,   // porcentaje
          total: totalCarrito,
          totalDescuento,
          productos
        }
      });
    }, 800);
  };

  if (cargandoPago) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h3 className="text-primary">
          <i className="bi bi-hourglass-split me-2"></i> Procesando pago...
        </h3>
      </div>
    );
  }

  return (
    <div className="lista-productos-container">
      <div className="lista-productos-wrapper py-3">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary fw-bold">
            <i className="bi bi-cart4 me-2"></i> Lista de Productos - Veterinaria
          </h2>
          <span className="badge bg-orange fs-6">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} en carrito
          </span>
        </div>

        {/* Buscador */}
        <div className="input-group mb-4 shadow-sm">
          <span className="input-group-text bg-success text-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Buscar por nombre o código de barras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            name="lp-buscar"
            id="lp-buscar"
          />
        </div>

        {/* Tabla de productos */}
        <div className="cardshadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Inventario</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th className="text-end">Precio</th>
                    <th className="text-center">Stock</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPagina.map((p, i) => {
                    const enCarrito = !!carrito[p.id];
                    const cant = carrito[p.id]?.cantidad || 0;
                    return (
                      <tr key={p.id}>
                        <td>{(paginaActual - 1) * productosPorPagina + i + 1}</td>
                        <td>
                          <img
                            className="ImagenTabla"
                            src={p.Imagen_producto ? `http://localhost:3000/uploads/${p.Imagen_producto}` : '/path/to/default/image.jpg'}
                            alt={p.Nombre_producto}
                            style={{ width: '50px' }}
                          />
                        </td>
                        <td>{p.Nombre_producto}</td>
                        <td><code>{p.Codigo_de_barras || 'N/A'}</code></td>
                        <td>
                          <span className="badge bg-info">
                            {p.tipo === 'paquete' ? 'Paquete' : 'Gramaje'}
                          </span>
                        </td>
                        <td className="text-end text-success fw-bold">
                          {p.tipo === "paquete"
                            ? formatearPrecio(obtenerPrecioUnitario(p))
                            : formatearPrecio(p.Precio_kilogramo || 0) + " /kg"}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${p.stock < 10 ? 'bg-warning' : 'bg-success'}`}>
                            {p.stock ?? 0}
                          </span>
                        </td>

                        {/* Cantidad: solo aparece cuando está en carrito */}
                        <td className="text-center">
                          {enCarrito ? (
                            <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => decrementar(p)}
                                className="btn-outline-red btn-small"
                                name={`btn-restar-${p.id}`}
                                id={`btn-restar-${p.id}`}
                                aria-label={`Restar ${p.Nombre_producto}`}
                              >−</button>

                              <input
                                type="number"
                                value={cant}
                                onChange={(e) => setCantidadManual(p, e.target.value)}
                                min={p.tipo === 'paquete' ? 1 : 1}
                                step={p.tipo === 'paquete' ? 1 : 1}
                                style={{ width: 90, textAlign: 'center', padding: '6px 8px', borderRadius: 6, border: '1px solid #ced4da' }}
                                name={`input-cantidad-${p.id}`}
                                id={`input-cantidad-${p.id}`}
                              />

                              <button
                                type="button"
                                onClick={() => incrementar(p)}
                                className="btn-outline-green btn-small"
                                name={`btn-sumar-${p.id}`}
                                id={`btn-sumar-${p.id}`}
                                aria-label={`Sumar ${p.Nombre_producto}`}
                              >+</button>

                            </div>
                          ) : (
                            <span style={{ color: '#999' }}>—</span>
                          )}
                        </td>

                        {/* Acciones: Agregar (si no está), Eliminar (si está) */}
                        <td className="text-center">
                          {enCarrito ? (
                            <button
                              type="button"
                              onClick={() => eliminarProducto(p.id)}
                              className="btn-outline-red"
                              name={`btn-eliminar-${p.id}`}
                              id={`btn-eliminar-${p.id}`}
                            >
                              Eliminar
                            </button>

                          ) : (
                            <button
                              type="button"
                              onClick={() => agregarAlCarrito(p)}
                              className="btn-outline-green"
                              name={`btn-agregar-${p.id}`}
                              id={`btn-agregar-${p.id}`}
                            >
                              <span style={{ fontWeight: 600, marginRight: 6 }}>+</span> Agregar
                            </button>

                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Paginación */}
        <nav className="my-4 d-flex justify-content-center">
          <ul className="pagination custom-pagination">
            <li className={`page-item ${paginaActual === 1 && 'disabled'}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
                name="lp-pag-prev"
                id="lp-pag-prev"
              >&laquo;</button>
            </li>
            {[...Array(totalPaginas)].map((_, i) => (
              <li key={i} className={`page-item ${paginaActual === i + 1 && 'active'}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(i + 1)}
                  name={`lp-pag-${i + 1}`}
                  id={`lp-pag-${i + 1}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${paginaActual === totalPaginas && 'disabled'}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual + 1)}
                name="lp-pag-next"
                id="lp-pag-next"
              >&raquo;</button>
            </li>
          </ul>
        </nav>

        {/* Resumen del carrito */}
        {Object.keys(carrito).length > 0 && (
          <div>
            <div className="card-header">
              <h5><i className="bi bi-cart-check me-2"></i>Resumen del Carrito</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio Unit.</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-center">% Desc.</th>
                    <th className="text-center">Tipo</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(carrito).map(([id, item]) => {
                    const producto = productos.find(p => p.id === parseInt(id));
                    const desc = descuentos[id] || 0;
                    return (
                      <tr key={id}>
                        <td>{producto?.Nombre_producto}</td>
                        <td className="text-center">
                          <span className="badge bg-primary">
                            {item.tipo === "gramaje" ? `${item.cantidad} g` : item.cantidad}
                          </span>
                        </td>
                        <td className="text-end">
                          {item.tipo === "paquete"
                            ? formatearPrecio(obtenerPrecioUnitario(producto))
                            : formatearPrecio(producto?.Precio_kilogramo || 0) + " /kg"}
                        </td>
                        <td className="text-end fw-bold">
                          {formatearPrecio(calcularSubtotal(producto, item.cantidad, desc))}
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            className="form-control form-control-sm"
                            value={descuentos[id] ?? ''}
                            placeholder="%"
                            onChange={(e) =>
                              setDescuentos({
                                ...descuentos,
                                [id]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                              })
                            }
                            style={{ width: '70px' }}
                            name={`input-descuento-${id}`}
                            id={`input-descuento-${id}`}
                          />
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info">
                            {item.tipo === 'paquete' ? 'Paquete' : 'Gramaje'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => eliminarProducto(Number(id))}
                            className="btn-outline-red"
                            name={`btn-eliminar-resumen-${id}`}
                            id={`btn-eliminar-resumen-${id}`}
                          >
                            Eliminar
                          </button>

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="table-warning">
                    <th colSpan="3" className="text-end">Descuento total:</th>
                    <th className="text-end text-danger">{formatearPrecio(totalDescuento)}</th>
                    <th></th>
                  </tr>
                  <tr className="table-success">
                    <th colSpan="3" className="text-end">TOTAL:</th>
                    <th className="text-end fs-5">{formatearPrecio(totalCarrito)}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>

              <div className="text-end">
                <button
                  onClick={irAPago}
                  className="btn-outline-green-lg"
                  name="btn-ir-pago"
                  id="btn-ir-pago"
                >
                  <i className="bi bi-cash me-2"></i>Proceder al pago
                </button>
                                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaProductos;
