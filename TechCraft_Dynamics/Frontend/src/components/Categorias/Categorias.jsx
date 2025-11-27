// Importaciones necesarias
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Css
import '../../css/Categorias/Categorias.css'

export default function Categorias() {
  const [masVendidos, setMasVendidos] = useState([]);
  const [menosVendidos, setMenosVendidos] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  // Conexion Local o con el Railway
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://tcd-production.up.railway.app';

  // Loading (Cargamos los datos antes mostrar)
  useEffect(() => {
    const cargarDatos = async () => {
      // Llamada al api para cargar datos
      try {
        const [resMas, resMenos] = await Promise.all([
          axios.get(`${API_URL}/api/productos/reportes/mas-vendidos`),
          axios.get(`${API_URL}/api/productos/reportes/menos-vendidos`)
        ]);
        // Carga de los datos 
        setMasVendidos(resMas.data);
        setMenosVendidos(resMenos.data);
        // Tiempo de carga
        setTimeout(() => {
          setCargandoInicial(false);
        }, 1200);
      } catch (error) {
        console.error("❌ Error cargando productos:", error);
        setCargandoInicial(false);
      }
    };

    cargarDatos();
  }, [API_URL]);

  // Mostramos el precio de los productos mejores y peores vendidos 
  const mostrarPrecio = (prod) => {
    const precio = prod.precio || prod.Precio_kilogramo || prod.Precio_libras || 0;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };
  // Mostramos las ventas de los productos mejore y peores vendidos (Es decir cuanto se vendio)
  const mostrarVentas = (prod) => {
    const cantidad = Number(prod.total_vendidos);
    if (prod.tipo_producto === "paquete") {
      return `${cantidad} paquete${cantidad !== 1 ? 's' : ''}`;
    }
    if (prod.tipo_producto === "gramaje") {
      if (prod.Precio_kilogramo) {
        return `${cantidad} kg`;
      }
      if (prod.Precio_libras) {
        return `${cantidad} lbs`;
      }
      return `${cantidad} unidades`;
    }
    return cantidad;
  };
  // Filtro de los productos para mejores y peores 
  const masPaquetes = masVendidos.filter(p => p.tipo_producto === "paquete");
  const masGramaje = masVendidos.filter(p => p.tipo_producto === "gramaje");
  const menosPaquetes = menosVendidos.filter(p => p.tipo_producto === "paquete");
  const menosGramaje = menosVendidos.filter(p => p.tipo_producto === "gramaje");

  // Tabla de los productos mejores y peores 
  const renderSeccion = (titulo, lista) => (
    <section className="bloque-seccion">
      <h3>{titulo}</h3>
      {/* Tabla de prodcutos */}
      <table className="tabla-contenedor">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ventas</th>
            <th>Precio</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody> {/* Ciclo de productos */}
          {lista.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.Nombre_producto}</td>
              <td>{mostrarVentas(prod)}</td>
              <td>{mostrarPrecio(prod)}</td>
              <td>
                <img 
                  src={`${API_URL}/uploads/${prod.Imagen_producto}`} 
                  alt={`Imagen de ${prod.Nombre_producto}`} 
                  className="tabla-img" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  // Mostrar carga en el Frontend
  if (cargandoInicial) {
    return (
      <div className="categorias-loading-screen">
        <div className="categorias-loading-content">
          <div className="categorias-loading-spinner">
            <span></span>
          </div>
          <h3 className="categorias-loading-text">Cargando categorías...</h3>
          <p className="categorias-loading-subtext">Espera un momento</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="titulo">CATEGORÍAS</h1>   
      <main className="contenedor-principal">

        <Link to="/admin/Categorias/Listado">
          <button className="G-categorias">
            <i className='bx bxs-edit-alt'></i>
            Gestionar categorias
          </button>
        </Link>
        {/* Renderizacion para ver los mejores productos vendidos */}
        <h2 className="Mas-V">Productos Más Vendidos</h2> 
        {renderSeccion("Paquetes", masPaquetes)}
        {renderSeccion("Gramaje", masGramaje)}
        {/* Renderizacion para ver los peores productos vendidos */}
        <h2 className="Menos-V">Productos Menos Vendidos</h2>
        {renderSeccion("Paquetes", menosPaquetes)}
        {renderSeccion("Gramaje", menosGramaje)}
      </main>
    </>
  );
}