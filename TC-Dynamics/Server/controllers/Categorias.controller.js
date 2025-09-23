const db = require('../models/conexion');

// Crear categoría
const crearCategorias = async (req, res) => {
    try {
        const { Nombre_categoria, Descripcion } = req.body;
        const Imagen_categoria = req.file ? req.file.filename : null;
        const query = `INSERT INTO Categorias (Imagen_categoria, Nombre_categoria, Descripcion) VALUES (?, ?, ?)`;
        const values = [Imagen_categoria, Nombre_categoria, Descripcion];

        const [result] = await db.query(query, values);
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar categorías
const listarCategorias = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Categorias WHERE activo = 1");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar categoría
const actualizarCategorias = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre_categoria, Descripcion } = req.body;
        let Imagen_categoria = req.file ? req.file.filename : req.body.Imagen_categoria || null;

        const query = `
            UPDATE Categorias
            SET Imagen_categoria = ?, Nombre_categoria = ?, Descripcion = ?
            WHERE id = ?`;
        const values = [Imagen_categoria, Nombre_categoria, Descripcion, id];

        await db.query(query, values);
        res.status(200).json({ message: "Categoría actualizada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM Categorias WHERE id = ? AND activo = 1';

        const [results] = await db.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar (soft delete)
const eliminarCategorias = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE Categorias SET activo = 0 WHERE id = ?", [id]);
        res.json({ message: 'La categoría ha sido desactivada (soft delete).' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Exportar
module.exports = {
    crearCategorias,
    listarCategorias,
    actualizarCategorias,
    obtenerCategoriaPorId,
    eliminarCategorias
};
