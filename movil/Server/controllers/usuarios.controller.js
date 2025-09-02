const db = require('../models/conexion');
const bcrypt = require('bcrypt');

// Cambiar contraseña del usuario
const cambiarContrasena = async (req, res) => {
  const id = req.params.id;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena || nuevaContrasena.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña es inválida o muy corta' });
  }

  try {
    const hash = await bcrypt.hash(nuevaContrasena, 12);
    await db.query('UPDATE Usuarios SET Contrasena = ? WHERE id = ?', [hash, id]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generar una contraseña aleatoria de 10 caracteres
function generarContrasena() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Usuarios WHERE activo = 1');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
const getUsuarioPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const {
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol
    } = req.body;

    const contrasenaGenerada = generarContrasena();
    const hash = await bcrypt.hash(contrasenaGenerada, 12);

    const sql = `
      INSERT INTO Usuarios 
      (Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Contrasena,
       Tipo_documento, Numero_documento, Numero_celular, 
       Correo_personal, Correo_empresarial, id_Rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, hash, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol
    ];

    const [result] = await db.query(sql, values);
    res.status(201).json({ message: 'Usuario creado', id: result.insertId, contrasena: contrasenaGenerada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const {
    Primer_Nombre, Segundo_Nombre, Primer_Apellido,
    Segundo_Apellido, Tipo_documento, Numero_documento,
    Numero_celular, Correo_personal, Correo_empresarial, id_Rol
  } = req.body;

  const sql = `
    UPDATE Usuarios SET
    Primer_Nombre = ?, Segundo_Nombre = ?, Primer_Apellido = ?, Segundo_Apellido = ?,
    Tipo_documento = ?, Numero_documento = ?, Numero_celular = ?, 
    Correo_personal = ?, Correo_empresarial = ?, id_Rol = ?
    WHERE id = ?`;

  const values = [
    Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido,
    Tipo_documento, Numero_documento, Numero_celular,
    Correo_personal, Correo_empresarial, id_Rol, id
  ];

  try {
    await db.query(sql, values);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar (desactivar) usuario
const eliminarUsuario = async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('UPDATE Usuarios SET activo = 0 WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Listar usuarios paginados con búsqueda por letra
// Listar usuarios paginados con búsqueda por letra
const listarUsuarios = async (req, res) => {
  const { page = 1, limit = 10, letra = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query;
    let countQuery;
    let values;

    if (letra) {
      query = `
        SELECT * FROM Usuarios 
        WHERE activo = 1 AND Primer_Nombre LIKE ? 
        ORDER BY Primer_Nombre ASC 
        LIMIT ? OFFSET ?
      `;
      countQuery = `
        SELECT COUNT(*) AS total 
        FROM Usuarios 
        WHERE activo = 1 AND Primer_Nombre LIKE ?
      `;
      values = [`${letra}%`, parseInt(limit), offset];
    } else {
      query = `
        SELECT * FROM Usuarios 
        WHERE activo = 1 
        ORDER BY Primer_Nombre ASC 
        LIMIT ? OFFSET ?
      `;
      countQuery = `
        SELECT COUNT(*) AS total 
        FROM Usuarios 
        WHERE activo = 1
      `;
      values = [parseInt(limit), offset];
    }

    const [usuarios] = await db.query(query, values);
    const [totalResult] = await db.query(countQuery, letra ? [`${letra}%`] : []);
    const total = totalResult[0].total;

    res.json({ usuarios, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Exportar como módulos
module.exports = {
  getUsuarios,
  getUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarContrasena,
  listarUsuarios 
};
