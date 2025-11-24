const db = require("../models/conexion");

// Helper para parsear JSON de forma segura
function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

// Helper: obtener último día del mes (mes = 1 a 12)
const getUltimoDiaMes = (anio, mes) => {
  return new Date(anio, mes, 0).getDate(); // JS: enero=0, así que mes=1 → febrero → día 0 = último de enero
};

const crearVenta = async (req, res) => {
  const connection = await db.getConnection(); // Usamos transacción
  try {
    await connection.beginTransaction();

    const { metodo_pago, info_pago, descripcion, detalles = [], estado = 1 } = req.body;
    if (!Array.isArray(detalles) || detalles.length === 0) {
      await connection.release();
      return res.status(400).json({ error: "No se enviaron productos en la venta" });
    }

    // Insertar la venta principal
    const [ventaResult] = await connection.query(
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

      const [prodRows] = await connection.query(
        "SELECT id, tipo_producto, precio, Precio_kilogramo, stock FROM Productos WHERE id = ? AND activo = 1 LIMIT 1",
        [producto_id]
      );

      if (!prodRows.length) continue;
      const producto = prodRows[0];

      let valorUnitario = 0;
      if (producto.tipo_producto === "paquete") {
        valorUnitario = Number(producto.precio || 0);
      } else if (producto.tipo_producto === "gramaje") {
        valorUnitario = (Number(producto.Precio_kilogramo || 0)) / 1000;
      }

      const descuentoNum = Number(descuento) || 0;
      if (valorUnitario <= 0) continue;

      // Insertar detalle
      const [detalleResult] = await connection.query(
        `INSERT INTO Detalle_venta (id_venta, id_producto, id_proveedor, cantidad, valor_unitario, descuento)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ventaId, producto_id, id_proveedor, cantidadNum, valorUnitario, descuentoNum]
      );
      inserts.push({ id: detalleResult.insertId, producto_id });

      // ✅ ACTUALIZAR STOCK
      let nuevoStock;
      if (id_proveedor !== null) {
        // Es una COMPRA → sumar stock
        nuevoStock = (producto.stock || 0) + cantidadNum;
      } else {
        // Es una VENTA → restar stock
        nuevoStock = (producto.stock || 0) - cantidadNum;
        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para el producto ID ${producto_id}`);
        }
      }

      await connection.query("UPDATE Productos SET stock = ? WHERE id = ?", [nuevoStock, producto_id]);
    }

    if (inserts.length === 0) {
      await connection.rollback();
      await connection.release();
      return res.status(400).json({ error: "No se insertaron productos válidos" });
    }

    await connection.commit();
    await connection.release();

    res.json({
      message: "✅ Venta/Compra registrada correctamente",
      ventaId,
      detalles: inserts
    });
  } catch (error) {
    await connection.rollback();
    await connection.release();
    console.error("❌ Error al crear venta:", error);
    res.status(500).json({ error: error.message || "Error al crear la venta/compra" });
  }
};

//  Listar ventas con sus detalles
const listarVentas = async (req, res) => {
  try {
    const { activo } = req.query;
    let query = "SELECT * FROM Venta";
    let params = [];

    if (activo !== undefined) {
      query += " WHERE activo = ?";
      params.push(activo);
    }

    const [ventas] = await db.query(query, params);

    for (let v of ventas) {
      const [detalles] = await db.query(
        `SELECT dv.*, p.Nombre_producto, pr.nombre_empresa 
         FROM Detalle_venta dv
         JOIN Productos p ON dv.id_producto = p.id
         LEFT JOIN Proveedores pr ON p.id_Proveedor = pr.id
         WHERE dv.id_venta = ?`,
        [v.id]
      );
      v.detalles = detalles;
      v.info_pago = v.info_pago ? safeParseJSON(v.info_pago) : null;
    }

    res.json(ventas);
  } catch (err) {
    console.error("❌ Error en listarVentas:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Obtener una venta por ID (con detalles y JSON parseado)
const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [ventas] = await db.query(`SELECT * FROM Venta WHERE id = ?`, [id]); // ⚠️ Tabla correcta: "Venta", no "Ventas"

    if (!ventas.length) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const venta = ventas[0];
    const [detalles] = await db.query(
      `SELECT d.*, p.Nombre_producto, p.tipo_producto
       FROM Detalle_venta d
       INNER JOIN Productos p ON d.id_producto = p.id
       WHERE d.id_venta = ?`,
      [id]
    );

    venta.info_pago = venta.info_pago ? safeParseJSON(venta.info_pago) : null;
    venta.detalles = detalles;

    res.json(venta);
  } catch (err) {
    console.error("❌ Error en obtenerVentaPorId:", err);
    res.status(500).json({ error: "Error al obtener la venta" });
  }
};

// ❌ FUNCIÓN DUPLICADA: `obtenerVenta` — ELIMINADA
// (Ya está cubierta por `obtenerVentaPorId`)

//  Actualizar estado (activo/inactivo)
const actualizarEstadoVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const [result] = await db.query("UPDATE Venta SET activo = ? WHERE id = ?", [activo, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json({ message: "Estado de venta actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar estado de venta" });
  }
};

//  Eliminar una venta (y sus detalles)
const eliminarVenta = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM Detalle_venta WHERE id_venta = ?", [id]);
    const [result] = await db.query("DELETE FROM Venta WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    res.json({ message: "✅ Venta eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar venta:", error);
    res.status(500).json({ error: "Error al eliminar la venta" });
  }
};

//  Eliminar todas las ventas (solo para desarrollo/test)
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

//  Total de ventas en un mes
const ventasMes = async (req, res) => {
  try {
    const { anio, mes } = req.params;
    const mesNum = parseInt(mes, 10);
    const primerDia = `${anio}-${String(mesNum).padStart(2, '0')}-01`;
    const ultimoDiaMes = getUltimoDiaMes(anio, mesNum);
    const ultimoDia = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimoDiaMes).padStart(2, '0')}`;

    const [ventas] = await db.query(`
      SELECT SUM(d.cantidad * d.valor_unitario - d.descuento) AS total
      FROM Detalle_venta d
      INNER JOIN Venta v ON d.id_venta = v.id
      WHERE v.fecha >= ? AND v.fecha <= ?
    `, [primerDia, ultimoDia]);

    res.json({ total: ventas[0].total || 0 });
  } catch (err) {
    console.error("❌ Error en ventasMes:", err);
    res.status(500).json({ error: "Error al obtener ventas del mes" });
  }
};

//  Comparativa de ventas por producto en un mes
const comparativaMes = async (req, res) => {
  try {
    const { anio, mes } = req.params;
    const { ids_productos } = req.body;

    if (!Array.isArray(ids_productos) || ids_productos.length === 0) {
      return res.status(400).json({});
    }

    const mesNum = parseInt(mes, 10);
    const primerDia = `${anio}-${String(mesNum).padStart(2, '0')}-01`;
    const ultimoDiaMes = getUltimoDiaMes(anio, mesNum);
    const ultimoDia = `${anio}-${String(mesNum).padStart(2, '0')}-${String(ultimoDiaMes).padStart(2, '0')}`;

    const placeholders = ids_productos.map(() => '?').join(',');
    const query = `
      SELECT p.id, SUM(d.cantidad) AS total_vendidos
      FROM Detalle_venta d
      INNER JOIN Venta v ON d.id_venta = v.id
      INNER JOIN Productos p ON d.id_producto = p.id
      WHERE v.fecha >= ? AND v.fecha <= ?
        AND p.id IN (${placeholders})
      GROUP BY p.id
    `;

    const params = [primerDia, ultimoDia, ...ids_productos.map(id => parseInt(id, 10))];
    const [rows] = await db.query(query, params);

    const resultado = {};
    rows.forEach(row => {
      resultado[row.id] = row.total_vendidos;
    });

    res.json(resultado);
  } catch (err) {
    console.error("❌ Error en comparativaMes:", err);
    res.status(500).json({ error: "Error al obtener comparativa" });
  }
};

module.exports = {
  crearVenta,
  listarVentas,
  obtenerVentaPorId,           
  actualizarEstadoVenta,
  eliminarVenta,
  eliminarGrupoVenta,         
  ventasMes,
  comparativaMes
};