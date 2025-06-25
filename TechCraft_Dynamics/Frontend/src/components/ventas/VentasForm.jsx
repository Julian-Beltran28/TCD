import React, { useState, useEffect } from 'react';
import { getVentas, crearVenta } from '../../services/ventasService';

function VentasForm() {
  const [ventas, setVentas] = useState([]);
  const [form, setForm] = useState({
    producto_id: '', Cantidad: '', Valor_Unitario: '', Descuento: '', Detalle_Venta: ''
  });

  useEffect(() => {
    getVentas().then(res => setVentas(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearVenta(form);
    const res = await getVentas();
    setVentas(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Registrar Venta</h2>
      <form onSubmit={handleSubmit}>
        <input name="producto_id" placeholder="Producto ID" onChange={handleChange} />
        <input name="Cantidad" placeholder="Cantidad" onChange={handleChange} />
        <input name="Valor_Unitario" placeholder="Valor Unitario" onChange={handleChange} />
        <input name="Descuento" placeholder="Descuento" onChange={handleChange} />
        <input name="Detalle_Venta" placeholder="Detalle" onChange={handleChange} />
        <button type="submit">Guardar</button>
      </form>
      <h3>Ventas registradas</h3>
      <ul>
        {ventas.map(v => (
          <li key={v.id}>
            ID: {v.id} - Producto: {v.producto_id} - Cant: {v.Cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VentasForm;