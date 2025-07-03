import express from 'express';
import bcrypt from 'bcryptjs';
import connection from './config/db.js';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware de sesiones
app.use(session({ 
  secret: 'techcraft_secret_key', 
  resave: false,
  saveUninitialized: false
}));

// Middleware general
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta inicial (vista login)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login.html'));
});

// Ruta logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error cerrando sesión');
    }
    res.clearCookie('connect.sid'); // Elimina la cookie de sesión
    res.status(200).send('Sesión cerrada');
  });
});


// Login
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  connection.query(
    'SELECT * FROM Usuarios WHERE Correo_personal = ?',
    [correo],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Error en el servidor' });

      if (results.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const usuario = results[0];
      const match = await bcrypt.compare(contrasena, usuario.Contrasena);

      if (!match) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
      
      req.session.usuario = usuario;

      const idRol = usuario.id_Rol;

      connection.query(
        'SELECT nombreRol FROM Roles WHERE id = ?',
        [idRol],
        (err, rolResult) => {
          if (err) return res.status(500).json({ message: 'Error al obtener rol' });

          const rol = rolResult[0]?.nombreRol;

          if (!rol) {
            return res.status(400).json({ message: 'Rol no reconocido' });
          }

          // ✅ ¡Respuesta única!
          return res.status(200).json({ rol });
        }
      );
    }
  );
});

// Rutas por rol
app.get('/admin', (req, res) => {
  if (req.session.usuario) {
    res.sendFile(path.join(__dirname, 'pages/admin/admin.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/empleado', (req, res) => {
  if (req.session.usuario) {
    res.sendFile(path.join(__dirname, 'pages/empleado.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/personal', (req, res) => {
  if (req.session.usuario) {
    res.sendFile(path.join(__dirname, 'pages/personal.html'));
  } else {
    res.redirect('/');
  }
});


// Inicia servidor
app.listen(4000, () => {
  console.log('✅ Servidor corriendo en http://localhost:4000');
});
