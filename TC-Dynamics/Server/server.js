// serve.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

// Importar rutas
const ventasRoutes = require('./routes/ventas.routes');
const comprasRoutes = require('./routes/compras.routes');
const productosRoutes = require('./routes/productos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const categoriasRoutes = require('./routes/Categorias.routes');
const subcategoriasRoutes = require('./routes/Subcategorias.routes');

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Servir carpeta /docs
// Esto permite acceder directamente a los archivos YAML
// Ejemplo: http://localhost:8084/docs/openapi.yaml
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// 📘 Configuración de Scalar Docs
(async () => {
  try {
    const scalarModule = await import('@scalar/express-api-reference');

    // Detectar correctamente la función principal
    const expressApiReference =
      scalarModule.default ||
      scalarModule.expressApiReference ||
      scalarModule.apiReference ||
      Object.values(scalarModule).find(v => typeof v === 'function');

    if (typeof expressApiReference !== 'function') {
      console.error('❌ Error: no se pudo importar correctamente expressApiReference.');
      console.error('Contenido del módulo:', scalarModule);
      return;
    }

    // Montar Scalar Docs
    app.use(
      '/scalar-docs',
      expressApiReference({
        spec: {
          url: '/docs/openapi.yaml', // Ruta al archivo YAML servido estáticamente
        },
        theme: 'purple',
        layout: 'modern',
      })
    );

    console.log(' Scalar Docs configurado correctamente');
    console.log(' Archivo de especificación: /docs/openapi.yaml');
  } catch (err) {
    console.error('❌ Error al configurar Scalar Docs:', err);
  }


// Rutas
app.use('/api/ventas', ventasRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/subcategorias', subcategoriasRoutes);
app.use('/api/productos', productosRoutes);

  // Servir imágenes
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚨 Manejo de rutas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 🚨 Manejo de errores internos
app.use((err, req, res, next) => {
  console.error('❌ Error en servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto dinámico
const PORT = process.env.PORT || 8084; 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📘 Scalar Docs disponibles en: http://localhost:${PORT}/scalar-docs`);
})})();
