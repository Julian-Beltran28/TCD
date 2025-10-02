// src/pages/admin/Reportes/Ventas.jsx
import React, { useState, useEffect } from 'react';
import '../../../css/admin/Reportes/Ventas.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://tcd-production.up.railway.app';

export default function Ventas() {
  const [ventasActual, setVentasActual] = useState(0);
  const [ventasPasado, setVentasPasado] = useState(0);
  const [topProducto, setTopProducto] = useState(null);
  const [otrosTop, setOtrosTop] = useState([]);
  const [comparativa, setComparativa] = useState({ labels: [], mesActual: [], mesPasado: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mesActual = hoy.getMonth() + 1; // getMonth() es 0-indexado
        const mesPasado = mesActual === 1 ? 12 : mesActual - 1;
        const anioPasado = mesActual === 1 ? anio - 1 : anio;

        // 1. Ventas del mes actual y pasado
        const [resActual, resPasado] = await Promise.all([
          fetch(`${API_URL}/api/ventas/total-mes/${anio}/${mesActual}`),
          fetch(`${API_URL}/api/ventas/total-mes/${anioPasado}/${mesPasado}`)
        ]);

        const dataActual = await resActual.json();
        const dataPasado = await resPasado.json();

        setVentasActual(dataActual.total || 0);
        setVentasPasado(dataPasado.total || 0);

        // 2. Top productos del mes actual
        const resTop = await fetch(`${API_URL}/api/productos/top-mes/${anio}/${mesActual}`);
        const topProductos = await resTop.json();

        if (topProductos.length > 0) {
          const top = topProductos[0];
          setTopProducto({
            nombre: top.Nombre_producto,
            imagen: top.Imagen_producto
              ? `${API_URL}/uploads/${top.Imagen_producto}`
              : 'https://via.placeholder.com/150?text=Sin+imagen',
            ventas: top.total_vendidos
          });

          // Otros top (índices 1 a 3)
          const otros = topProductos.slice(1, 4).map(p => ({
            nombre: p.Nombre_producto,
            ventas: p.total_vendidos,
            imagen: p.Imagen_producto
              ? `${API_URL}/uploads/${p.Imagen_producto}`
              : 'https://via.placeholder.com/100?text=Sin+imagen'
          }));
          setOtrosTop(otros);
        }

        // 3. Comparativa: necesitamos top del mes actual + ventas del mes pasado para esos mismos productos
        const nombresTop = topProductos.map(p => p.Nombre_producto);
        const idsTop = topProductos.map(p => p.id);

        // Obtener ventas del mes pasado para los mismos productos
        const [resPasadoProd] = await Promise.all([
          fetch(`${API_URL}/api/ventas/comparativa-mes/${anioPasado}/${mesPasado}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids_productos: idsTop })
          })
        ]);

        const comparativaPasado = await resPasadoProd.json(); // { [id]: total }

        const labels = nombresTop;
        const mesActualData = topProductos.map(p => p.total_vendidos);
        const mesPasadoData = idsTop.map(id => comparativaPasado[id] || 0);

        setComparativa({
          labels,
          mesActual: mesActualData,
          mesPasado: mesPasadoData
        });

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos de ventas:', err);
        setError('No se pudieron cargar los datos. Intente más tarde.');
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const dataComparativa = {
    labels: comparativa.labels,
    datasets: [
      {
        label: 'Mes actual',
        data: comparativa.mesActual,
        backgroundColor: '#28a745',
      },
      {
        label: 'Mes pasado',
        data: comparativa.mesPasado,
        backgroundColor: '#ffc107',
      },
    ],
  };

  const opcionesComparativa = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) return <div className="ventas-container"><p>Cargando datos...</p></div>;
  if (error) return <div className="ventas-container"><p className="error">{error}</p></div>;

  return (
    <div className="ventas-container">
      <h1 className="titulo-principal">Panel de Ventas</h1>

      {/* Ventas actuales y pasadas */}
      <div className="ventas-metricas">
        <div className="ventas-card actual">
          <h4>Ventas del Mes Actual</h4>
          <p className="valor">${ventasActual.toLocaleString()}</p>
        </div>
        <div className="ventas-card pasado">
          <h4>Ventas del Mes Pasado</h4>
          <p className="valor">${ventasPasado.toLocaleString()}</p>
        </div>
      </div>

      {/* Productos top */}
      <div className="productos-top-section">
        {topProducto && (
          <div className="producto-top-destacado">
            <h4>🏆 Producto Top del Mes</h4>
            <img src={topProducto.imagen} alt="Top producto" />
            <p className="nombre">{topProducto.nombre}</p>
            <p className="ventas">{topProducto.ventas} ventas</p>
          </div>
        )}

        <div className="otros-productos-top">
          <h4>🔝 Otros Productos Destacados</h4>
          <ul>
            {otrosTop.map((prod, i) => (
              <li key={i}>
                <img src={prod.imagen} alt={prod.nombre} />
                <div className="info">
                  <span className="nombre">{prod.nombre}</span>
                  <span className="ventas">{prod.ventas} ventas</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gráfica comparativa */}
      <div className="grafica-tablas">
        <h4>📊 Comparativa de Productos (Mes Actual vs. Mes Pasado)</h4>
        <Bar data={dataComparativa} options={opcionesComparativa} />
      </div>
    </div>
  );
}