// Controlador de Productos actualizado para mysql2/promise
const db = require('../models/conexion');

// Crear productos en paquetes
const crearProductoPaquetes = async (req, res) => {
    try {
        const { Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor } = req.body;
        const Imagen_producto = req.file ? req.file.filename : null;
        const tipo_producto = 'paquete';

        const query = `
            INSERT INTO ProductosPaquete (Imagen_producto, Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor, tipo_producto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [Imagen_producto, Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor, tipo_producto];
        const [result] = await db.query(query, values);

        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear productos en gramaje
const crearProductoGramaje = async (req, res) => {
    try {
        const { Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor } = req.body;
        const Imagen_producto = req.file ? req.file.filename : null;
        const tipo_producto = 'gramaje';

        const query = `
            INSERT INTO ProductosGramaje (Imagen_producto, Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor, tipo_producto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [Imagen_producto, Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor, tipo_producto];
        const [result] = await db.query(query, values);

        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error("Error en crearProductoGramaje:", err);
        res.status(500).json({ error: err.message });
    }
};

// Listar productos en paquetes
const listarProductosPaquetes = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ProductosPaquete WHERE activo = 1");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar productos en gramaje
const listarProductosGramaje = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ProductosGramaje WHERE activo = 1");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar productos en paquetes
const actualizarProductosPaquetes = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor } = req.body;
        const Imagen_producto = req.file ? req.file.filename : req.body.Imagen_producto;

        const query = `
            UPDATE ProductosPaquete
            SET Imagen_producto=?, Nombre_producto=?, Precio=?, Descripcion=?, Codigo_de_barras=?, Stock=?, id_SubCategorias=?, id_Proveedor=?
            WHERE id=?
        `;

        const values = [Imagen_producto, Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor, id];
        await db.query(query, values);

        res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar productos en gramaje
const actualizarProductosGramaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor } = req.body;
        const Imagen_producto = req.file ? req.file.filename : req.body.Imagen_producto;

        const query = `
            UPDATE ProductosGramaje
            SET Imagen_producto=?, Nombre_producto=?, Kilogramos=?, Precio_kilogramo=?, Libras=?, Precio_libras=?, Descripcion=?, id_SubCategorias=?, id_Proveedor=?
            WHERE id=?
        `;

        const values = [Imagen_producto, Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor, id];
        await db.query(query, values);

        res.status(200).json({ message: "Producto actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar productos en paquetes (soft delete)
const eliminarProductosPaquetes = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE ProductosPaquete SET activo = 0 WHERE id = ?", [id]);
        res.json({ message: 'El producto ha sido eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar productos en gramaje (soft delete)
const eliminarProductosGramaje = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE ProductosGramaje SET activo = 0 WHERE id = ?", [id]);
        res.json({ message: 'El producto ha sido eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar todos los productos (paquete + gramaje)
const listarTodosLosProductos = async (req, res) => {
  try {
    const [productosPaquete] = await db.query("SELECT *, 'paquete' AS tipo_producto FROM ProductosPaquete WHERE activo = 1");
    const [productosGramaje] = await db.query("SELECT *, 'gramaje' AS tipo_producto FROM ProductosGramaje WHERE activo = 1");

    const todosLosProductos = [...productosPaquete, ...productosGramaje];

    res.status(200).json(todosLosProductos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
    crearProductoGramaje,
    crearProductoPaquetes,
    listarProductosGramaje,
    listarProductosPaquetes,
    listarTodosLosProductos, // <- este
    actualizarProductosGramaje,
    actualizarProductosPaquetes,
    eliminarProductosGramaje,
    eliminarProductosPaquetes
};

