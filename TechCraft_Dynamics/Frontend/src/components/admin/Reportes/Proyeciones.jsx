import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';
import '../../../css/admin/Reportes/Proyecciones.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

export default function Proyecciones() {
  const [crecimiento] = useState(18); // porcentaje simulado
  const [inversion] = useState(750000); // pesos simulados
  const [productosTop, setProductosTop] = useState([]);

  useEffect(() => {
    setProductosTop([
      { nombre: 'Laptop ASUS', ventas: 34 },
      { nombre: 'Teclado Mecánico RGB', ventas: 27 },
      { nombre: 'Monitor 27”', ventas: 21 },
    ]);
  }, []);

  const data = {
    labels: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    datasets: [
      {
        label: 'Ventas actuales',
        data: [500, 700, 800, 950, 1100, 1300],
        borderColor: '#007bff',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Proyección',
        data: [1100, 1250, 1400, 1550, 1700, 1900],
        borderColor: '#28a745',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Tendencia',
        data: [900, 1000, 1150, 1300, 1500, 1750],
        borderColor: '#ffc107',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="proyecciones-container">
      <h1 className="proyecciones-titulo-principal">Panel de Proyecciones</h1>

      <div className="proyecciones-metricas">
        <div className="proyecciones-card">
          <h4>Crecimiento Proyectado</h4>
          <p className="proyecciones-porcentaje">{crecimiento}%</p>
        </div>

        <div className="proyecciones-card">
          <h4>Inversión Estimada</h4>
          <p className="proyecciones-valor">${inversion.toLocaleString()}</p>
        </div>
      </div>

      <div className="proyecciones-grafico-lineas">
        <h4>📈 Proyección de Ventas</h4>
        <Line data={data} options={options} />
      </div>

      <div className="proyecciones-analisis-temporada">
        <h4>🔥 Análisis de Temporada - Productos Top</h4>
        <ul>
          {productosTop.map((prod, idx) => (
            <li key={idx}>
              <strong>{prod.nombre}</strong>: {prod.ventas} ventas
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
