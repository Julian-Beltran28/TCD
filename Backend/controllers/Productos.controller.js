const db = require('../config/db');

// Crear productos en paquetes
const crearProductoPaquetes = (req, res) => {
    const {  Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor} = req.body;
    const Imagen_producto = req.file ? req.file.filename : null;
    const tipo_producto = 'paquete';
    console.log("Archivo recibido:", req.file); 
    console.log('Datos recibidos:', req.body);
    const query = 
        `INSERT INTO ProductosPaquete (Imagen_producto, Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor, tipo_producto)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [ Imagen_producto, Nombre_producto, Precio, Descripcion, Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor, tipo_producto ];

    db.query(query, values, (err, result) => {
    if (err) {
        console.error("Error al insertar en ProductosGramaje:", err); // 👈 más claro
        return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId });
});
};

// Crear productos en gramaje
const crearProductoGramaje = (req, res) => {
    const { Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor } = req.body;
    const Imagen_producto = req.file ? req.file.filename : null;
    const tipo_producto = 'gramaje';

    console.log('Datos recibidos:', req.body);

    const query = 
        `INSERT INTO ProductosGramaje (Imagen_producto, Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor, tipo_producto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
    const values = [ Imagen_producto, Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor, tipo_producto ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al insertar en ProductosGramaje:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId });
    });
};

// Listamos todas los productos en paquetes exitentes.
const listarProductosPaquetes = (req, res) => {
    db.query("SELECT * FROM ProductosPaquete", (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        res.status(200).json(rows); // enviar los datos
    });
};

// listamos todos los productos en gramaje exitentes. 
const listarProductosGramaje = (req, res) => {
    db.query("SELECT * FROM ProductosGramaje", (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        res.status(200).json(rows); // enviar los datos
    });
};

// Actualizacion de los productos en paquetes.
const actualizarProductosPaquetes = (req, res) => {
    const { id } = req.params;
    const {
        Nombre_producto, Precio, Descripcion, Codigo_de_barras,
        Stock, id_SubCategorias, id_Proveedor
    } = req.body;

    const Imagen_producto = req.file ? req.file.filename : req.body.Imagen_producto;
    console.log('Datos recibidos:', req.body);
    const query = `
        UPDATE ProductosPaquete
        SET Imagen_producto=?, Nombre_producto=?, Precio=?, Descripcion=?, Codigo_de_barras=?, Stock=?, id_SubCategorias=?, id_Proveedor=?
        WHERE id=?`;
    const values = [
        Imagen_producto, Nombre_producto, Precio, Descripcion,
        Codigo_de_barras, Stock, id_SubCategorias, id_Proveedor, id
    ];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Producto actualizado correctamente" });
    });
};

// Actualizacion de los productos en grammaje.
const actualizarProductosGramaje = (req, res) => {
    const { id } = req.params;
    const {
        Nombre_producto, Kilogramos, Precio_kilogramo,
        Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor
    } = req.body;

    const Imagen_producto = req.file ? req.file.filename : req.body.Imagen_producto;

    const query = `
        UPDATE ProductosGramaje
        SET Imagen_producto=?, Nombre_producto=?, Kilogramos=?, Precio_kilogramo=?, Libras=?, Precio_libras=?, Descripcion=?, id_SubCategorias=?, id_Proveedor=?
        WHERE id=?`;

    const values = [
        Imagen_producto, Nombre_producto, Kilogramos, Precio_kilogramo,
        Libras, Precio_libras, Descripcion, id_SubCategorias, id_Proveedor, id
    ];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Producto actualizado correctamente" });
    });
};


// Eliminar productos en paquetes.
const eliminarProductosPaquetes = (req, res) => {
    const {id} = req.params;
    db.query("UPDATE ProductosPaquete SET activo = 0 WHERE id =?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message })
            res.json({ message: 'El producto ha sido eliminado exitosamente'});
    });
};

// Eliminar productos en gramaje.
const eliminarProductosGramaje = (req, res) => {
    const {id} = req.params;
    db.query("UPDATE ProductosGramaje SET activo = 0 WHERE id =?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message })
            res.json({ message: 'El producto ha sido eliminado exitosamente'});
    });
};

module.exports = {
    crearProductoGramaje,
    crearProductoPaquetes,
    listarProductosGramaje,
    listarProductosPaquetes,
    actualizarProductosGramaje,
    actualizarProductosPaquetes,
    eliminarProductosGramaje,
    eliminarProductosPaquetes
};