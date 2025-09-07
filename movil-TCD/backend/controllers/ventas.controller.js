const db = require("../models/conexion");

// Helper para parsear JSON
function safeParseJSON(str) {
  try { return JSON.parse(str); } catch { return str; }
}

// ✅ Crear venta (multi-producto) con Venta + Detalle_venta
const crearVenta = async (req, res) => {
  try {
    const { metodo_pago, info_pago, descripcion, detalles = [], estado = 1 } = req.body;

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ error: "No se enviaron productos en la venta" });
    }

    // Insertar la venta principal
    const [ventaResult] = await db.query(
      `INSERT INTO Venta (metodo_pago, info_pago, detalle, activo)
       VALUES (?, ?, ?, ?)`,
      [
        metodo_pago || null,
        info_pago ? JSON.stringify(info_pago) : null,
        descripcion || "Venta desde sistema",
        estado
      ]
    );

    const ventaId = ventaResult.insertId;
    const inserts = [];

    for (const d of detalles) {
      const { producto_id, cantidad, descuento = 0, id_proveedor = null } = d;
      const cantidadNum = Number(cantidad) || 0;
      if (!producto_id || cantidadNum <= 0) continue;

      const [prodRows] = await db.query(
        "SELECT id, tipo_producto, precio, Precio_kilogramo, Precio_libras FROM Productos WHERE id = ? AND activo = 1 LIMIT 1",
        [producto_id]
      );
      if (!prodRows.length) continue;

      const producto = prodRows[0];
      let valorUnitario = 0;

      if (producto.tipo_producto === "paquete") valorUnitario = Number(producto.precio || 0);
      else if (producto.tipo_producto === "gramaje") valorUnitario = Number(producto.Precio_kilogramo || 0) / 1000;

      const descuentoNum = Number(descuento) || 0;
      if (cantidadNum <= 0 || valorUnitario <= 0) continue;

      const [detalleResult] = await db.query(
        `INSERT INTO Detalle_venta 
          (id_venta, id_producto, id_proveedor, cantidad, valor_unitario, descuento)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          ventaId,
          producto_id,
          id_proveedor,
          cantidadNum,
          valorUnitario,
          descuentoNum
        ]
      );
      


      inserts.push({ id: detalleResult.insertId, producto_id });
    }

    if (inserts.length === 0) return res.status(400).json({ error: "No se insertaron productos válidos" });

    res.json({
      message: "✅ Venta registrada correctamente",
      ventaId,
      detalles: inserts
    });

  } catch (error) {
    console.error("❌ Error al crear venta:", error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
};

// ✅ Listar ventas con detalles
const listarVentas = async (req, res) => {
  try {
    const [ventas] = await db.query(`
      SELECT * FROM Venta ORDER BY fecha DESC
    `);

    const resultados = [];

    for (const v of ventas) {
      const [detalles] = await db.query(`
        SELECT d.*, p.Nombre_producto, p.tipo_producto
        FROM Detalle_venta d
        INNER JOIN Productos p ON d.id_producto = p.id
        WHERE d.id_venta = ?
      `, [v.id]);

      resultados.push({
        ...v,
        info_pago: v.info_pago ? safeParseJSON(v.info_pago) : null,
        detalles
      });
    }

    res.json(resultados);
  } catch (error) {
    console.error("❌ Error al listar ventas:", error);
    res.status(500).json({ error: "Error al listar ventas" });
  }
};

// ✅ Obtener venta por ID
const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [ventas] = await db.query(`SELECT * FROM Venta WHERE id = ?`, [id]);
    if (!ventas.length) return res.status(404).json({ error: "Venta no encontrada" });

    const venta = ventas[0];
    const [detalles] = await db.query(`
      SELECT d.*, p.Nombre_producto, p.tipo_producto
      FROM Detalle_venta d
      INNER JOIN Productos p ON d.id_producto = p.id
      WHERE d.id_venta = ?
    `, [id]);

    venta.info_pago = venta.info_pago ? safeParseJSON(venta.info_pago) : null;
    venta.detalles = detalles;

    res.json(venta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la venta" });
  }
};

// ✅ Cambiar estado de venta
const actualizarEstadoVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    const [result] = await db.query("UPDATE Venta SET activo = ? WHERE id = ?", [activo ? 1 : 0, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.json({ message: `✅ Venta ${activo ? "aceptada" : "cancelada"} correctamente` });
  } catch (error) {
    console.error("❌ Error al actualizar estado de venta:", error);
    res.status(500).json({ error: "Error al actualizar el estado de la venta" });
  }
};

// ✅ Eliminar venta y sus detalles
const eliminarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Detalle_venta WHERE id_venta = ?", [id]);
    const [result] = await db.query("DELETE FROM Venta WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.json({ message: "✅ Venta eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar venta:", error);
    res.status(500).json({ error: "Error al eliminar la venta" });
  }
};

// ✅ Eliminar todas las ventas
const eliminarGrupoVenta = async (req, res) => {
  try {
    await db.query("DELETE FROM Detalle_venta");
    const [result] = await db.query("DELETE FROM Venta");
    res.json({ message: `✅ Se eliminaron ${result.affectedRows} ventas` });
  } catch (error) {
    console.error("❌ Error al eliminar todas las ventas:", error);
    res.status(500).json({ error: "Error al eliminar todas las ventas" });
  }
};

module.exports = {
  crearVenta,
  listarVentas,
  actualizarEstadoVenta,
  eliminarVenta,
  eliminarGrupoVenta,
  obtenerVentaPorId
};
