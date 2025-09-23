// Conexión a la base de datos
const db = require('../models/conexion');

// Crear subcategoría
const crearSubcategorias = async (req, res) => {
    try {
        const { Nombre_Subcategoria, Descripcion, id_Categorias } = req.body;
        const query = `
            INSERT INTO SubCategorias (Nombre_Subcategoria, Descripcion, id_Categorias)
            VALUES (?, ?, ?)
        `;
        const values = [Nombre_Subcategoria, Descripcion, id_Categorias];
        const [result] = await db.query(query, values);
        res.status(201).json({ id: result.insertId, mensaje: 'Subcategoría creada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar todas las subcategorías activas
const listarSubcategorias = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM SubCategorias WHERE activo = 1");
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener subcategoría por ID
const obtenerSubcategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            "SELECT * FROM SubCategorias WHERE id = ? AND activo = 1",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Subcategoría no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar subcategoría
const actualizarSubcategorias = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre_Subcategoria, Descripcion, id_Categorias } = req.body;
        const query = `
            UPDATE SubCategorias
            SET Nombre_Subcategoria = ?, Descripcion = ?, id_Categorias = ?
            WHERE id = ?
        `;
        const values = [Nombre_Subcategoria, Descripcion, id_Categorias, id];
        await db.query(query, values);
        res.status(200).json({ mensaje: 'Subcategoría actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar subcategoría (soft delete)
const eliminarSubcategorias = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE SubCategorias SET activo = 0 WHERE id = ?", [id]);
        res.status(200).json({ mensaje: 'Subcategoría desactivada correctamente (soft delete)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Exportar funciones
module.exports = {
    crearSubcategorias,
    listarSubcategorias,
    obtenerSubcategoriaPorId,
    actualizarSubcategorias,
    eliminarSubcategorias
};
