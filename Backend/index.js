const express = require('express'); // Conexion al APPI
const app = express(); // Se manda los datos al app.
const cors = require('cors'); // Para manejar mejor las bases de datos"
const path = require('path'); // Decimos que el path va ser "/".

console.log('🚀 Iniciando servidor...');
// llamamos a las rutas.
const categoriasRoutes = require('./routes/Categorias.routes');
const subcategoriasRoutes = require('./routes/Subcategorias.routes');
const productosRoutes = require('./routes/Productos.routes');
const proveedoresRoutes = require('./routes/Proveedor.routes');

app.use(cors()); 
app.use(express.json()); // Creo que aca la informacion va ser en tipo JSON.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



//Montamos las rutas.
app.use('/api/categorias', categoriasRoutes);
app.use('/api/subcategorias', subcategoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);

console.log('✅ Rutas configuradas');

// Corremos todo el backend en el puerto 3000.
app.listen(3000, () => {
    console.log('🌐 Servidor backend corriendo en: http://localhost:3000');
})


