const db = require('../models/conexion');

const crearVenta = (req, res) => {
    const { producto_id, Cantidad, Valor_Unitario, Descuento, Detalle_Venta } = req.body;
    const query = \`
        INSERT INTO Ingreso_ventas (producto_id, Cantidad, Valor_Unitario, Descuento, Detalle_Venta)
        VALUES (?, ?, ?, ?, ?)\`;
    db.query(query, [producto_id, Cantidad, Valor_Unitario, Descuento, Detalle_Venta], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId });
    });
};

const listarVentas = (req, res) => {
    db.query("SELECT * FROM Ingreso_ventas", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

module.exports = { crearVenta, listarVentas };