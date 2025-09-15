// src/controllers/productos.controller.js
const db = require('../models/conexion');

// ======================= CREAR =======================
const crearProducto = async (req, res) => {
  try {
    const {
      Nombre_producto,
      precio,
      stock,
      Kilogramos,
      Precio_kilogramo,
      Libras,
      Precio_libras,
      Descripcion,
      Codigo_de_barras,
      id_SubCategorias,
      id_Proveedor,
      tipo_producto
    } = req.body;

    const Imagen_producto = req.file ? req.file.filename : null;

    const query = `
      INSERT INTO Productos
      (Imagen_producto, Nombre_producto, precio, stock, Kilogramos, Precio_kilogramo, Libras, Precio_libras, 
       Descripcion, Codigo_de_barras, id_SubCategorias, id_Proveedor, tipo_producto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      Imagen_producto,
      Nombre_producto,
      precio || null,
      stock || null,
      Kilogramos || null,
      Precio_kilogramo || null,
      Libras || null,
      Precio_libras || null,
      Descripcion,
      Codigo_de_barras,
      id_SubCategorias,
      id_Proveedor,
      tipo_producto
    ];

    const [result] = await db.query(query, values);

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("❌ Error en crearProducto:", err);
    res.status(500).json({ error: err.message });
  }
};

// ======================= LISTAR =======================
const listarProductos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Productos WHERE activo = 1");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error en listarProductos:", err);
    res.status(500).json({ error: err.message });
  }
};

// ======================= ACTUALIZAR =======================
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Nombre_producto,
      precio,
      stock,
      Kilogramos,
      Precio_kilogramo,
      Libras,
      Precio_libras,
      Descripcion,
      Codigo_de_barras,
      id_SubCategorias,
      id_Proveedor,
      tipo_producto
    } = req.body;

    const Imagen_producto = req.file ? req.file.filename : req.body.Imagen_producto;

    const query = `
      UPDATE Productos
      SET Imagen_producto=?, Nombre_producto=?, precio=?, stock=?, Kilogramos=?, Precio_kilogramo=?, Libras=?, Precio_libras=?, 
          Descripcion=?, Codigo_de_barras=?, id_SubCategorias=?, id_Proveedor=?, tipo_producto=?
      WHERE id=?
    `;

    const values = [
      Imagen_producto,
      Nombre_producto,
      precio || null,
      stock || null,
      Kilogramos || null,
      Precio_kilogramo || null,
      Libras || null,
      Precio_libras || null,
      Descripcion,
      Codigo_de_barras,
      id_SubCategorias,
      id_Proveedor,
      tipo_producto,
      id
    ];

    await db.query(query, values);

    res.status(200).json({ message: "✅ Producto actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error en actualizarProducto:", err);
    res.status(500).json({ error: err.message });
  }
};

// ======================= ELIMINAR =======================
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE Productos SET activo = 0 WHERE id = ?", [id]);
    res.json({ message: '🗑️ Producto eliminado (soft delete)' });
  } catch (err) {
    console.error("❌ Error en eliminarProducto:", err);
    res.status(500).json({ error: err.message });
  }
};

// ======================= REPORTES =======================
// TOP 5 Más vendidos
const masVendidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.Nombre_producto,
        SUM(d.cantidad) AS total_vendidos,
        p.precio,
        p.Precio_kilogramo,
        p.Precio_libras,
        p.Imagen_producto,
        p.tipo_producto
      FROM Detalle_venta d
      INNER JOIN Productos p ON d.id_producto = p.id
      GROUP BY p.id, p.Nombre_producto, p.precio, p.Precio_kilogramo, p.Precio_libras, p.Imagen_producto, p.tipo_producto
      ORDER BY total_vendidos DESC
      LIMIT 5;
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error en masVendidos:", error);
    res.status(500).json({ message: "Error al obtener los productos más vendidos" });
  }
};

// TOP 5 Menos vendidos
const menosVendidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.Nombre_producto,
        SUM(d.cantidad) AS total_vendidos,
        p.precio,
        p.Precio_kilogramo,
        p.Precio_libras,
        p.Imagen_producto,
        p.tipo_producto
      FROM Detalle_venta d
      INNER JOIN Productos p ON d.id_producto = p.id
      GROUP BY p.id, p.Nombre_producto, p.precio, p.Precio_kilogramo, p.Precio_libras, p.Imagen_producto, p.tipo_producto
      ORDER BY total_vendidos ASC
      LIMIT 5;
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error en menosVendidos:", error);
    res.status(500).json({ message: "Error al obtener los productos menos vendidos" });
  }
};

// ======================= OBTENER POR ID =======================
const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM Productos WHERE id = ? AND activo = 1", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error en obtenerProducto:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/productos/top-mes/:anio/:mes
const topProductosMes = async (req, res) => {
  try {
    const { anio, mes } = req.params;
    const primerDia = `${anio}-${String(mes).padStart(2,'0')}-01`;
    const ultimoDia = `${anio}-${String(mes).padStart(2,'0')}-31`;

    const [productos] = await db.query(`
      SELECT p.*, SUM(d.cantidad) AS total_vendidos
      FROM Detalle_venta d
      INNER JOIN Venta v ON d.id_venta = v.id
      INNER JOIN Productos p ON d.id_producto = p.id
      WHERE v.fecha >= ? AND v.fecha <= ?
      GROUP BY p.id
      ORDER BY total_vendidos DESC
      LIMIT 5
    `, [primerDia, ultimoDia]);

    res.json(productos);
  } catch (err) {
    console.error("❌ Error en topProductosMes:", err);
    res.status(500).json({ error: "Error al obtener productos top del mes" });
  }
};

// ======================= EXPORT =======================
module.exports = {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto,
  masVendidos,
  menosVendidos,
  obtenerProducto,
  topProductosMes
};
