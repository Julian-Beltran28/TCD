import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../css/admin/ventas/Lista_Productos.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext"; // ajusta la ruta

const ListaProductos = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ así accedes al usuario
  const rol = user?.rol; // 👈 así obtienes el rol real
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [descuentos, setDescuentos] = useState({});
  const [search, setSearch] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargandoPago, setCargandoPago] = useState(false);

  const productosPorPagina = 5;

  // Obtener productos
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/productos/todos');
        console.log('Productos obtenidos:', res.data); // Verifica los datos aquí
        setProductos(res.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    obtenerProductos();
  }, []);

  // Funciones carrito
  const agregarAlCarrito = (id) => {
    setCarrito(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => {
      const nuevo = { ...prev };
      if (nuevo[id] > 1) nuevo[id]--;
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

  // Formato precio
  const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);

  const obtenerPrecio = (p) => {
    if (p.tipo_producto === 'paquete') {
      return Number(p.precio) || 0; // Precio para paquetes
    } else if (p.tipo_producto === 'gramaje') {
      return Number(p.Precio_kilogramo) || Number(p.Precio_libras) || 0; // Precio por kilogramo o libra
    }
    return 0; // Si no es ninguno de los dos
  };

  // Filtros y paginación
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
  const totalCarrito = Object.entries(carrito).reduce((total, [id, cant]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    if (!prod) return total;
    const precio = obtenerPrecio(prod);
    const desc = descuentos[id] || 0;
    return total + (precio * cant * (1 - desc / 100));
  }, 0);

  const totalDescuento = Object.entries(carrito).reduce((total, [id, cant]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    if (!prod) return total;
    const precio = obtenerPrecio(prod);
    const desc = descuentos[id] || 0;
    return total + (precio * cant * (desc / 100));
  }, 0);

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

    // Normalizar el rol
    const rolNormalizado = rol?.toLowerCase();
    let basePath = "";

    if (rolNormalizado === "personal") {
      basePath = "staff";
    } else if (["staff", "supervisor", "admin"].includes(rolNormalizado)) {
      basePath = rolNormalizado;
    } else {
      alert("Rol de usuario desconocido. No se puede proceder al pago.");
      return;
    }

    // Mostrar pantalla de carga
    setCargandoPago(true);

    setTimeout(() => {
      navigate(`/${basePath}/pago`, {
        state: {
          carrito,
          descuentos,
          total: totalCarrito,
          totalDescuento,
          productos
        }
      });
    }, 1500); // 1.5 segundos de "cargando"
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
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary fw-bold">
            <i className="bi bi-cart4 me-2"></i> Lista de Productos - Veterinaria
          </h2>
          <span className="badge bg-orange fs-6">
            {Object.values(carrito).reduce((a, b) => a + b, 0)} items en carrito
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
                  {productosPagina.map((p, i) => (
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
                          {p.tipo_producto === 'paquete' ? 'Paquete' : 'Gramaje'}
                        </span>
                      </td>
                      <td className="text-end text-success fw-bold">
                        {formatearPrecio(obtenerPrecio(p))}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${p.stock < 10 ? 'bg-warning' : 'bg-success'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="text-center">
                        {carrito[p.id] ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-danger" onClick={() => eliminarDelCarrito(p.id)}>-</button>
                            <span className="btn btn-outline-secondary disabled">{carrito[p.id]}</span>
                            <button className="btn btn-outline-success" onClick={() => agregarAlCarrito(p.id)}>+</button>
                          </div>
                        ) : (
                          <span className="badge bg-secondary">0</span>
                        )}
                      </td>
                      <td className="text-center">
                        {carrito[p.id] ? (
                          <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => agregarAlCarrito(p.id)}>
                            <i className="bi bi-plus me-1"></i> Agregar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Paginación */}
        <nav className="my-4 d-flex justify-content-center">
          <ul className="pagination custom-pagination">
            <li className={`page-item ${paginaActual === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>&laquo;</button>
            </li>
            {[...Array(totalPaginas)].map((_, i) => (
              <li key={i} className={`page-item ${paginaActual === i + 1 && 'active'}`}>
                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${paginaActual === totalPaginas && 'disabled'}`}>
              <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>&raquo;</button>
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
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(carrito).map(([id, cantidad]) => {
                    const producto = productos.find(p => p.id === parseInt(id));
                    return (
                      <tr key={id}>
                        <td>{producto?.Nombre_producto}</td>
                        <td className="text-center"><span className="badge bg-primary">{cantidad}</span></td>
                        <td className="text-end">{formatearPrecio(obtenerPrecio(producto))}</td>
                        <td className="text-end fw-bold">
                          {formatearPrecio((obtenerPrecio(producto) * cantidad) * (1 - (descuentos[id] || 0) / 100))}
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            min={10}
                            max={100}
                            className="form-control form-control-sm"
                            value={descuentos[id] || ''}
                            placeholder="%"
                            onChange={(e) =>
                              setDescuentos({
                                ...descuentos,
                                [id]: Math.min(100, Math.max(10, parseInt(e.target.value) || 0))
                              })
                            }
                            style={{ width: '70px' }}
                          />
                        </td>
                        <td className="text-center">
                          <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
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

              {/* Botón de ir al pago */}
              <div className="text-end">
                <button className="btn btn-success" onClick={irAPago}>
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
