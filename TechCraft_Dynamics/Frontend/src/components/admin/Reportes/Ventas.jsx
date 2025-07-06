// src/pages/admin/Reportes/Ventas.jsx
import React, { useState } from 'react';
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

export default function Ventas() {
  const [ventasActual] = useState(450000);
  const [ventasPasado] = useState(375000);
  const [topProducto] = useState({
    nombre: 'Laptop ASUS',
    imagen: 'https://m.media-amazon.com/images/I/71bJuMKaiSL._AC_SL1100_.jpg',
    ventas: 34,
  });

  const [otrosTop] = useState([
    {
      nombre: 'Teclado Mecánico',
      ventas: 27,
      imagen: 'https://m.media-amazon.com/images/I/71wVSE4pL8L._AC_SL1500_.jpg'
    },
    {
      nombre: 'Monitor 27”',
      ventas: 21,
      imagen: 'https://m.media-amazon.com/images/I/81c+9BOQNWL._AC_SL1500_.jpg'
    }
  ]);

  const [comparativa] = useState({
    labels: ['Laptop ASUS', 'Monitor 27”', 'Teclado Mecánico'],
    mesActual: [34, 21, 27],
    mesPasado: [20, 25, 15],
  });

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
        <div className="producto-top-destacado">
          <h4>🏆 Producto Top del Mes</h4>
          <img src={topProducto.imagen} alt="Top producto" />
          <p className="nombre">{topProducto.nombre}</p>
          <p className="ventas">{topProducto.ventas} ventas</p>
        </div>

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
