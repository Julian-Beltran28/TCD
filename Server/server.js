const express = require('express');
const cors = require('cors');
const path = require('path');

// Ventas
const ventasRoutes = require('./routes/ventas.routes');
const comprasRoutes = require('./routes/compras.routes');
const productosRoutes = require('./routes/productos.routes');
// Proveedor
const proveedoresRoutes = require('./routes/proveedores.routes');
// auth routes
const authRoutes = require('./routes/auth.routes');
// Perfil
const perfilRoutes = require('./routes/perfil.routes'); 
// Usuarios 
const usuariosRoutes = require('./routes/usuarios.routes'); 
// Categorias
const categoriasRoutes = require('./routes/Categorias.routes');
const subcategoriasRoutes = require('./routes/Subcategorias.routes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { title } = require('process');
const { url } = require('inspector');

const app = express();

app.use(cors());
app.use(express.json());

// Configuracion del swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info:{
      title: 'API del proyecto TechCraft Dynamics',
      version: '1.0.0',
      description: 'Documentación del API REST con Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Ruta del backend
      },
    ],
  },
  apis: ['./Documentation/*.yaml'],  // Se dirige a la carpeta de Documentation
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Montar rutas 
app.use('/api/ventas', ventasRoutes);
app.use('/api/compras', comprasRoutes);

app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);
app.use('/api/perfil', perfilRoutes); // ✅ Ruta del perfil montada
app.use('/api/usuarios', usuariosRoutes); // ✅ Ruta de usuarios montada

app.use('/api/categorias', categoriasRoutes);
app.use('/api/subcategorias', subcategoriasRoutes);
app.use('/api/productos', productosRoutes);


// Servir imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(8081, () => {
  console.log('Servidor corriendo en http://localhost:8081');
  console.log('Swagger docs corriendo en http://localhost:8081/api-docs');
});

