const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SAOanime37*',
  database: 'techCraft'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conectado a la base de datos MySQL.');
  }
});

app.post('/registrar', upload.single('imagen'), (req, res) => {
  const { nombre, exportacion, represent, apellido, numero, correo } = req.body;
  const imagen = req.file;

  if (!imagen) {
    return res.status(400).json({ mensaje: 'Imagen no proporcionada' });
  }

  const sql = `
    INSERT INTO proveedores 
    (nombre_empresa, tipo_exportacion, nombre_representante, apellido_representante, numero_empresarial, correo_empresarial, imagen_empresa) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nombre, exportacion, represent, apellido, numero, correo, imagen.filename],
    (err) => {
      if (err) {
        console.error('Error al insertar proveedor:', err);
        return res.status(500).json({ mensaje: 'Error al registrar proveedor' });
      }
      return res.json({ mensaje: 'Proveedor registrado con imagen' });
    }
  );
});

app.get("/proveedores/", (req, res) => {
  db.query("SELECT * FROM proveedores", (err, result) => {
    if (err) {
      console.error('Error al obtener proveedores:', err);
      return res.status(500).send("Error al obtener proveedores");
    }
    res.json(result);
  });
});

app.put("/update", upload.single('imagen'), (req, res) => {
  const { id, nombre, exportacion, represent, apellido, numero, correo } = req.body;
  const imagen = req.file ? req.file.filename : null;

  let sql, values;

  if (imagen) {
    sql = `
      UPDATE proveedores 
      SET nombre_empresa = ?, tipo_exportacion = ?, nombre_representante = ?, apellido_representante = ?, 
          numero_empresarial = ?, correo_empresarial = ?, imagen_empresa = ?
      WHERE id = ?
    `;
    values = [nombre, exportacion, represent, apellido, numero, correo, imagen, parseInt(id)];
  } else {
    sql = `
      UPDATE proveedores 
      SET nombre_empresa = ?, tipo_exportacion = ?, nombre_representante = ?, apellido_representante = ?, 
          numero_empresarial = ?, correo_empresarial = ?
      WHERE id = ?
    `;
    values = [nombre, exportacion, represent, apellido, numero, correo, parseInt(id)];
  }

  db.query(sql, values, (err) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).send("Error al actualizar proveedor");
    }
    res.send("Proveedor actualizado correctamente");
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);

  db.query("DELETE FROM proveedores WHERE id = ?", [id], (err) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).send("Error al eliminar proveedor");
    }
    res.send("Proveedor eliminado correctamente");
  });
});

app.get("/", (req, res) => {
  res.send("API de Proveedores funcionando correctamente");
});

app.listen(5000, () => {
  console.log('Servidor backend corriendo en http://localhost:5000');
});
