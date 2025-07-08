const db = require('../config/db');

const obtenerProveedores = (req, res) => {
    const query = "SELECT * FROM Proveedores";

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener proveedores:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) return res.status(404).json({ mensaje: "No se encontraron proveedores" });
        res.status(200).json(results);
    });
};

module.exports = {
    obtenerProveedores
};