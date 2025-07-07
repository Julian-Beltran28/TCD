const express = require('express');
const cors = require('cors');
const path = require('path');

const ventasRoutes = require('./routes/ventas.routes');
const comprasRoutes = require('./routes/compras.routes');
const productosRoutes = require('./routes/productos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes'); // ✅ Agregado
const usuariosRoutes = require('./routes/usuarios.routes'); // ✅ Usuarios

const app = express();

app.use(cors());
app.use(express.json());

// Montar rutas 
app.use('/api/ventas', ventasRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);
app.use('/api/perfil', perfilRoutes); // ✅ Ruta del perfil montada
app.use('/api/usuarios', usuariosRoutes); // ✅ Ruta de usuarios montada


// Servir imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
