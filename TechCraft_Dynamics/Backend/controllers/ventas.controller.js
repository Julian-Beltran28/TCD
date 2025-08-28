const db = require('../models/conexion');

// Crear venta con productos paquete y gramaje
const crearVenta = async (req, res) => {
  const { metodo_pago, descripcion, detalles, info_pago } = req.body;

  const valores = detalles.map(item => {
    const esPaquete = item.tipo === 'paquete';

    return [
      esPaquete ? item.producto_id : null,            // id_ProductosPaquete
      !esPaquete ? item.producto_id : null,           // id_ProductosGramaje
      item.cantidad,
      item.valor_unitario,
      item.descuento || 0,
      metodo_pago,
      JSON.stringify(info_pago),
      descripcion
    ];
  });

  const query = `
    INSERT INTO Ingreso_ventas (
      id_ProductosPaquete,
      id_ProductosGramaje,
      Cantidad,
      Valor_Unitario,
      Descuento,
      metodo_pago,
      info_pago,
      Detalle_Venta
    )
    VALUES ?
  `;

  try {
    await db.query(query, [valores]);
    res.status(201).json({ mensaje: 'Venta registrada correctamente' });
  } catch (err) {
    console.error('Error insertando la venta:', err);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

// Listar ventas con JOIN condicional y nombres de tablas corregidos
const listarVentas = async (req, res) => {
  const query = `
    SELECT 
      iv.id, 
      iv.metodo_pago, 
      iv.info_pago, 
      iv.Detalle_Venta AS descripcion, 
      iv.fecha,
      iv.Cantidad, 
      iv.Valor_Unitario, 
      iv.Descuento, 
      iv.SubTotal,
      COALESCE(pp.Nombre_producto, pg.Nombre_producto) AS NombreProducto,
      CASE 
        WHEN iv.id_ProductosPaquete IS NOT NULL THEN 'paquete'
        WHEN iv.id_ProductosGramaje IS NOT NULL THEN 'gramaje'
        ELSE 'desconocido'
      END AS tipo
    FROM Ingreso_ventas iv
    LEFT JOIN ProductosPaquete pp ON iv.id_ProductosPaquete = pp.id
    LEFT JOIN ProductosGramaje pg ON iv.id_ProductosGramaje = pg.id
    ORDER BY iv.id DESC
  `;

  try {
    const [rows] = await db.query(query);

    const ventas = rows.map(row => ({
      id: row.id,
      tipo: row.tipo,
      producto: row.NombreProducto,
      cantidad: row.Cantidad,
      valor_unitario: row.Valor_Unitario,
      descuento: row.Descuento,
      subtotal: row.SubTotal,
      metodo_pago: row.metodo_pago,
      info_pago: safeParseJSON(row.info_pago),
      descripcion: row.descripcion,
      fecha: row.fecha
    }));

    res.json(ventas);
  } catch (err) {
    console.error('Error al listar ventas:', err);
    res.status(500).json({ error: 'Error al listar las ventas' });
  }
};

// Función para parsear JSON sin romper si viene nulo o malformado
const safeParseJSON = (json) => {
  if (!json) return null;
  try {
    return typeof json === 'string' ? JSON.parse(json) : json;
  } catch (err) {
    console.warn('Error al parsear info_pago:', err);
    return null;
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

// Eliminar venta por ID directamente (una sola fila)
const eliminarVentaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM Ingreso_ventas WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({ mensaje: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar venta por ID:', error);
    res.status(500).json({ error: 'Error al eliminar venta por ID' });
  }
};



module.exports = {
  crearVenta,
  listarVentas,
  eliminarVenta,
  eliminarGrupoVenta,
  eliminarVentaPorId,
};
