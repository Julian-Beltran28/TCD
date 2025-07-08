// Conexion a la base de datos.
const db = require('../config/db');

// Creamos las Subcategorias.
const crearSubcategorias = (req, res) =>{
    const { Nombre_Subcategoria,  Descripcion, id_Categorias} = req.body;
    const query = 
        `INSERT INTO SubCategorias ( Nombre_Subcategoria,  Descripcion, id_Categorias) 
        VALUES ( ?, ?, ? )`; 
    const values = [Nombre_Subcategoria,  Descripcion, id_Categorias];
 
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({id: result.insertId });
    });
};

// Listamos todas las subcategorias exitentes 
const listarSubcategorias = (req, res) => {
    db.query("SELECT * FROM SubCategorias WHERE activo = 1", (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json(rows); // enviar los datos

    });
};

// Actualizamos las subcategorias dependiendo del id.
const actualizarSubcategorias = (req, res) => {
    const { id } = req.params;
    const { Nombre_Subcategoria, Descripcion, id_Categorias } = req.body;

    const query = 
        `UPDATE SubCategorias 
         SET Nombre_Subcategoria = ?, Descripcion = ?, id_Categorias = ?
         WHERE id = ?`;
    const values = [Nombre_Subcategoria, Descripcion, id_Categorias, id];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ mensaje: "Subcategoría actualizada correctamente" });
    });
};

const obtenerSubcategoriaPorId = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM SubCategorias WHERE id = ? AND activo = 1";
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
        res.status(200).json(results[0]);
    });
};

// Eliminamos la subcategorias dependiendo del id.
const eliminarSubcategorias = (req, res) => {
    const {id} = req.params;
    db.query("UPDATE SubCategorias SET activo = 0 WHERE id =?", [id], (err) =>{  // Usamo el soft delete para desactivar y no eliminar. 
        if (err) return res.status(500).json({ error: err.message });
        res.json({message: 'La categoria ha sido desactivada (soft delete).' });
    });
};

// EXportamos lo modulos.
module.exports = {
    crearSubcategorias,
    listarSubcategorias,
    actualizarSubcategorias,
    obtenerSubcategoriaPorId,
    eliminarSubcategorias
};