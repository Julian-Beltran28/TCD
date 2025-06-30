    const db = require('../models/conexion');

    const crearProducto = (req, res) => {
        const { imagen_producto, Nombre_productos, Descripcion, Codigo_de_barras, stock, id_SubCategorias, precio } = req.body;
        const query = `
            INSERT INTO Productos (imagen_producto, Nombre_productos, Descripcion, Codigo_de_barras, stock, id_SubCategorias, precio)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [imagen_producto, Nombre_productos, Descripcion, Codigo_de_barras, stock, id_SubCategorias, precio];

        db.query(query, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId });
        });
    };

    const listarProductos = (req, res) => {
        db.query("SELECT * FROM Productos", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    };

    const actualizarProducto = (req, res) => {
        const { id } = req.params;
        const { imagen_producto, Nombre_productos, Descripcion, Codigo_de_barras, stock, id_SubCategorias, precio } = req.body;
        const query = `
            UPDATE Productos 
            SET imagen_producto=?, Nombre_productos=?, Descripcion=?, Codigo_de_barras=?, stock=?, id_SubCategorias=?, precio=?
            WHERE id=?`;
        const values = [imagen_producto, Nombre_productos, Descripcion, Codigo_de_barras, stock, id_SubCategorias, precio, id];

        db.query(query, values, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado correctamente' });
        });
    };

    const eliminarProducto = (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM Productos WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto eliminado correctamente' });
        });
    };

    module.exports = {
        crearProducto,
        listarProductos,
        actualizarProducto,
        eliminarProducto
    };
