// Nos conectamos a la bases de datos desde mi archivo CONEXION.JS.
const db = require('../config/db');

// Creamos las categorias, insertamos los nuevos datos.
const crearCategorias = (req, res) => {
    // Variable para pedir la informacion del formulario.
    const { Nombre_categoria, Descripcion } = req.body;
    const Imagen_categoria = req.file ? req.file.filename : null;
    const query =   
        `INSERT INTO Categorias ( Imagen_categoria, Nombre_categoria, Descripcion) 
        VALUES ( ?, ?, ?)`; // Insercion de los datos a la base de datos.
    const values = [Imagen_categoria, Nombre_categoria, Descripcion]; 

    // Controlador de errores. 
    db.query(query, values, (err, result) => {
        if(err) return res.status(500).json({ error: err.message }); // Da el mensaje si hay un error para la incersion.
        res.status(201).json({ id: result.insertId }); // Muestra la insercion de forma exitosa. y da un ID.
    });
};


const listarCategorias = (req, res) => {
    db.query("SELECT * FROM Categorias WHERE activo = 1", (err, rows) => { // Traemos todas las categorias exitentes en las bases de datos.
        if(err) {return res.status(500).json({ error: err.message});
        } 
        res.status(200).json(rows);  
    });
};

const actualizarCategorias = (req, res) => {
    const { id } = req.params;
    const { Nombre_categoria, Descripcion } = req.body;

    let Imagen_categoria;

    // Si llega una imagen nueva, la usamos; si no, usamos la que ya estaba
    if (req.file) {
        Imagen_categoria = req.file.filename;
    } else if (req.body.Imagen_categoria) {
        Imagen_categoria = req.body.Imagen_categoria;
    } else {
        Imagen_categoria = null; // o dejarlo sin actualizar si prefieres
    }

    const query = `
        UPDATE Categorias
        SET Imagen_categoria = ?, Nombre_categoria = ?, Descripcion = ?
        WHERE id = ?`;

    const values = [Imagen_categoria, Nombre_categoria, Descripcion, id];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Categoría actualizada correctamente" });
    });
};

const obtenerCategoriaPorId = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Categorias WHERE id = ? AND activo = 1';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(results[0]); // devolvemos solo un objeto, no un array
    });
};

const eliminarCategorias = (req, res) => {
    const {id} = req.params;
    db.query("UPDATE Categorias SET activo = 0 WHERE id =?", [id], (err) =>{  // Usamo el soft delete para desactivar y no eliminar. 
        if (err) return res.status(500).json({ error: err.message });
        res.json({message: 'La categoria ha sido desactivada (soft delete).' });
    });
};

// Exportamos todos lo modulos de las consultas. 
module.exports = {
    crearCategorias,
    listarCategorias,
    actualizarCategorias,
    obtenerCategoriaPorId,
    eliminarCategorias
};
