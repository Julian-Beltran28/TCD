import express from 'express';  // Express para manejar las rutas
import bcrypt from 'bcryptjs'; // bcrypt para manejar contraseñas encriptadas
import connection from './config/db.js'; // esta es la conexión a MySQL2
import session from 'express-session'; // express-session para manejar sesiones
import path from 'path'; // path para manejar rutas de archivos
import { fileURLToPath } from 'url'; // para obtener la ruta del archivo actual


// configuraciones iniciales, con esto importo el modulo de express, bcryptjs, la conexión a la base de datos y el modulo de sesiones
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(session({ 
  secret: 'techcraft_secret_key', 
  resave: false,
  saveUninitialized: false
}));

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error al cerrar sesión'); // Si hay un error al cerrar sesión, lo notifica
    }
    res.redirect('/');
  });
});

// Middleware 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // sirve para servir o cargar archivos estáticos como CSS, imágenes, etc.

// esta es la ruta que carga el archivo HTML de inicio de sesión
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login.html'));
});

// Esta es la ruta del login
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  // CAPTURA LOS DATOS DEL FORMULARIO O TABLA
  connection.query(
    'SELECT * FROM Usuarios WHERE Correo_personal = ?',
    [correo],
    async (err, results) => { // esto se encarga de buscar el correo en la base de datos
      if (err) throw err;

      if (results.length === 0) {
        return res.send('Usuario no encontrado');
      }

      const usuario = results[0];

      const match = await bcrypt.compare(contrasena, usuario.Contrasena); // si encuentra al usuario, lo notifica. Si lo encuentra continuaa


      // este apartado de codigo es la redireccion por el rol dependiendo del usuario
      if (match) {
  const idRol = usuario.id_Rol;

  // Obtener el nombre del rol
  connection.query('SELECT nombreRol FROM Roles WHERE id = ?', [idRol], (err, rolResult) => {
    if (err) throw err;

    const rol = rolResult[0].nombreRol;

    // envia según el rol escogido o seleccionado por el usuario , pero solo si lka contraseña y el correo es correcto

    if (rol === 'Admin') { // Redirige al administrador
      res.redirect('/admin'); 

    } else if (rol === 'Empleado') { // Redirige al empleado
      res.redirect('/empleado'); 

    } else if (rol === 'Personal') { // Redirige al personal
      res.redirect('/personal'); 
    } else {
      res.send('Rol no reconocido'); // el rol no es reconocido y lo notifica
    }
  });
} else {
        res.send('Contraseña incorrecta');
      }
    }
  );
});

// Rutas segun el roñ
app.get('/admin', (req, res) => { // Ruta para el administrador
  res.sendFile(path.join(__dirname, 'pages/admin/admin.html'));
});

app.get('/empleado', (req, res) => { // Ruta para el empleado
  res.sendFile(path.join(__dirname, 'pages/empleado.html'));
});

app.get('/personal', (req, res) => { // Ruta para el personal
  res.sendFile(path.join(__dirname, 'pages/personal.html'));
});


// Manejo de errores 404
app.listen(4000, () => {
  console.log('Servidor corriendo en http://localhost:5173'); // Iniciar el servidor en el puerto 4000
});
