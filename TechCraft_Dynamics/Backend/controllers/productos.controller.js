// src/controllers/productos.controller.js
const db = require('../models/conexion');

const crearProducto = async (req, res) => {
  const {
    imagen_producto,
    Nombre_productos,
    Descripcion,
    Codigo_de_barras,
    stock,
    id_SubCategorias,
    precio
  } = req.body;

  const query = `
    INSERT INTO Productos 
    (imagen_producto, Nombre_productos, Descripcion, Codigo_de_barras, stock, id_SubCategorias, precio)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    imagen_producto,
    Nombre_productos,
    Descripcion,
    Codigo_de_barras,
    stock,
    id_SubCategorias,
    precio
  ];

  try {
    const [result] = await db.query(query, values);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: error.message });
  }
};

const listarProductos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Productos");
    res.json(rows);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ error: error.message });
  }
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const {
    imagen_producto,
    Nombre_productos,
    Descripcion,
    Codigo_de_barras,
    stock,
    id_SubCategorias,
    precio
  } = req.body;

  const query = `
    UPDATE Productos 
    SET imagen_producto=?, Nombre_productos=?, Descripcion=?, Codigo_de_barras=?, stock=?, id_SubCategorias=?, precio=?
    WHERE id=?`;

  const values = [
    imagen_producto,
    Nombre_productos,
    Descripcion,
    Codigo_de_barras,
    stock,
    id_SubCategorias,
    precio,
    id
  ];

  try {
    await db.query(query, values);
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM Productos WHERE id = ?", [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto
};
