const db = require('../models/conexion');

// Crear venta
const crearVenta = async (req, res) => {
  const { metodo_pago, descripcion, detalles, info_pago } = req.body;

  const query = `
    INSERT INTO Ingreso_ventas 
    (producto_id, Cantidad, Valor_Unitario, Descuento, metodo_pago, info_pago, Detalle_Venta)
    VALUES ?
  `;

  const valores = detalles.map(item => [
    item.producto_id,
    item.cantidad,
    item.valor_unitario,
    item.descuento || 0,
    metodo_pago,
    JSON.stringify(info_pago),
    descripcion
  ]);

  try {
    await db.query(query, [valores]);
    res.status(201).json({ mensaje: 'Venta registrada correctamente' });
  } catch (err) {
    console.error('Error insertando la venta:', err);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

// Listar ventas
const listarVentas = async (req, res) => {
  const query = `
    SELECT iv.id, iv.metodo_pago, iv.info_pago, iv.Detalle_Venta AS descripcion, iv.fecha,
           iv.Cantidad, iv.Valor_Unitario, iv.Descuento, iv.SubTotal,
           p.Nombre_productos
    FROM Ingreso_ventas iv
    JOIN Productos p ON iv.producto_id = p.id
    ORDER BY iv.id DESC
  `;

  try {
    const [rows] = await db.query(query);
    const ventas = rows.map(row => ({
      id: row.id,
      producto: row.Nombre_productos,
      cantidad: row.Cantidad,
      valor_unitario: row.Valor_Unitario,
      descuento: row.Descuento,
      subtotal: row.SubTotal,
      metodo_pago: row.metodo_pago,
      info_pago: typeof row.info_pago === 'string' ? JSON.parse(row.info_pago) : row.info_pago,
      descripcion: row.descripcion,
      fecha: row.fecha
    }));

    res.json(ventas);
  } catch (err) {
    console.error('Error al listar ventas:', err);
    res.status(500).json({ error: 'Error al listar las ventas' });
  }
};

// Eliminar TODA la venta por su grupo (basado en info_pago y descripción)
const eliminarVenta = async (req, res) => {
  const id = req.params.id;

  try {
    const [results] = await db.query(`
      SELECT info_pago, Detalle_Venta
      FROM Ingreso_ventas
      WHERE id = ?
      LIMIT 1
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    const { info_pago, Detalle_Venta } = results[0];

    await db.query(`
      DELETE FROM Ingreso_ventas
      WHERE info_pago = ? AND Detalle_Venta = ?
    `, [info_pago, Detalle_Venta]);

    res.json({ message: 'Venta eliminada completamente' });
  } catch (err) {
    console.error('Error al eliminar la venta:', err);
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};

// Eliminar grupo de ventas por fecha, método de pago y descripción
const eliminarGrupoVenta = async (req, res) => {
  const { fecha, metodo_pago, descripcion } = req.body;

  try {
    await db.query(`
      DELETE FROM Ingreso_ventas 
      WHERE fecha = ? AND metodo_pago = ? AND Detalle_Venta = ?
    `, [fecha, metodo_pago, descripcion]);

    res.json({ mensaje: 'Grupo de ventas eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar grupo de ventas:', err);
    res.status(500).json({ error: 'Error al eliminar grupo de ventas' });
  }
};

module.exports = {
  crearVenta,
  listarVentas,
  eliminarVenta,
  eliminarGrupoVenta
};
